'use strict';

const net = require('node:net');
const { spawn } = require('node:child_process');

function httpError(message, status) { return Object.assign(new Error(message), { status }); }

function normalizeAddress(value) {
  if (typeof value !== 'string' || !net.isIP(value)) throw httpError('Invalid proxy address', 400);
  if (value.startsWith('::ffff:') && net.isIP(value.slice(7)) === 4) return value.slice(7);
  return net.isIP(value) === 6 ? new URL(`http://[${value}]/`).hostname.slice(1, -1) : value;
}

function trustedProxies(value = '') {
  return new Set(value.split(',').map((address) => address.trim()).filter(Boolean).map(normalizeAddress));
}

function clientAddress(request, trusted) {
  let current = normalizeAddress(request.socket.remoteAddress);
  if (!trusted.has(current) || !request.headers['x-forwarded-for']) return current;
  const header = request.headers['x-forwarded-for'];
  if (typeof header !== 'string' || header.length > 1024) throw httpError('Invalid proxy address chain', 400);
  const chain = header.split(',');
  if (chain.length > 16) throw httpError('Invalid proxy address chain', 400);
  for (let index = chain.length - 1; index >= 0 && trusted.has(current); index--) {
    current = normalizeAddress(chain[index].trim());
  }
  return current;
}

function verifyPassword(password, file, { timeoutMs = 5000, spawnProcess = spawn } = {}) {
  return new Promise((resolve, reject) => {
    let child;
    try { child = spawnProcess('htpasswd', ['-vi', file, 'admin'], { stdio: ['pipe', 'ignore', 'ignore'] }); }
    catch (_) { reject(httpError('Password verification is unavailable', 503)); return; }
    let expired = false;
    const timer = setTimeout(() => { expired = true; child.kill('SIGKILL'); }, timeoutMs);
    child.stdin.on('error', () => {});
    child.once('error', () => { clearTimeout(timer); reject(httpError('Password verification is unavailable', 503)); });
    child.once('close', (code) => {
      clearTimeout(timer);
      if (expired) reject(httpError('Password verification timed out', 503));
      else resolve(code === 0);
    });
    child.stdin.end(`${password}\n`);
  });
}

class LoginGuard {
  constructor(verify, { maxConcurrent = 4, maxAddresses = 4096, attempts = 5, windowMs = 300000, now = Date.now } = {}) {
    this.verify = verify;
    this.maxConcurrent = maxConcurrent;
    this.maxAddresses = maxAddresses;
    this.attempts = attempts;
    this.windowMs = windowMs;
    this.now = now;
    this.active = 0;
    this.addresses = new Map();
  }

  async authenticate(address, readPassword) {
    const now = this.now();
    for (const [key, entry] of this.addresses) {
      if (!entry.active && entry.resetAt <= now) this.addresses.delete(key);
    }
    const entry = this.addresses.get(address) || { failures: 0, active: 0, resetAt: now + this.windowMs };
    if (entry.resetAt <= now) { entry.failures = 0; entry.resetAt = now + this.windowMs; }
    if (entry.failures + entry.active >= this.attempts) throw httpError('Too many login attempts; try again later', 429);
    if (this.active >= this.maxConcurrent || (!this.addresses.has(address) && this.addresses.size >= this.maxAddresses)) {
      throw httpError('Login is busy; try again later', 503);
    }
    // Reserve before reading the body or starting asynchronous password verification.
    this.addresses.set(address, entry);
    entry.active++;
    this.active++;
    let success = false;
    try {
      const password = await readPassword();
      if (typeof password !== 'string' || !password.length || Buffer.byteLength(password) > 1024 || /[\r\n\0]/.test(password)
        || !await this.verify(password)) throw httpError('Incorrect password', 401);
      success = true;
    } finally {
      entry.active--;
      this.active--;
      if (!success) entry.failures++;
      if (!entry.active && !entry.failures) this.addresses.delete(address);
    }
  }
}

function sessionCookie(token, ageSeconds, https) {
  return `awg3_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${ageSeconds}${https ? '; Secure' : ''}`;
}

module.exports = { LoginGuard, verifyPassword, clientAddress, trustedProxies, sessionCookie };
