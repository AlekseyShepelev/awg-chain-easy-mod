'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { LoginGuard, verifyPassword, trustedProxies, clientAddress, sessionCookie } = require('../app/auth');

test('concurrent login bodies reserve attempts before awaiting input', async () => {
  let checks = 0;
  const guard = new LoginGuard(async () => { checks++; return false; }, { maxConcurrent: 16 });
  const reads = [];
  const results = Promise.allSettled(Array.from({ length: 12 }, () => guard.authenticate('client',
    () => new Promise((resolve) => reads.push(resolve)))));
  assert.equal(reads.length, 5);
  reads.forEach((resolve) => resolve('fixture'));
  const failures = await results;
  assert.equal(checks, 5);
  assert.equal(failures.filter((item) => item.reason.status === 429).length, 7);
  await assert.rejects(guard.authenticate('client', () => 'fixture'), { status: 429 });
  assert.equal(guard.active, 0);
});

test('password work and address tracking stay bounded and expired entries are reclaimed', async () => {
  let now = 0;
  const guard = new LoginGuard(async () => false, { maxConcurrent: 1, maxAddresses: 1, now: () => now });
  let release;
  const active = assert.rejects(guard.authenticate('one', () => new Promise((resolve) => { release = resolve; })), { status: 401 });
  await assert.rejects(guard.authenticate('two', () => 'fixture'), { status: 503 });
  release('fixture'); await active;
  await assert.rejects(guard.authenticate('two', () => 'fixture'), { status: 503 });
  now = 300001;
  await assert.rejects(guard.authenticate('two', () => 'fixture'), { status: 401 });
  assert.equal(guard.addresses.size, 1); assert.equal(guard.addresses.has('one'), false);
});

test('successful login does not erase concurrent failures and malformed input never spawns a verifier', async () => {
  const checks = [];
  const guard = new LoginGuard((password) => new Promise((resolve) => checks.push({ password, resolve })));
  const first = guard.authenticate('client', () => 'first');
  const second = assert.rejects(guard.authenticate('client', () => 'second'), { status: 401 });
  await new Promise((resolve) => setImmediate(resolve));
  checks[0].resolve(true); checks[1].resolve(false);
  await Promise.all([first, second]);
  assert.equal(guard.addresses.get('client').failures, 1);
  const rejectInput = new LoginGuard(() => { throw new Error('Verifier must not run'); });
  for (const password of [null, '', 'a\nb', 'a\0b', 'a'.repeat(1025)]) {
    await assert.rejects(rejectInput.authenticate(String(password?.length), () => password), { status: 401 });
  }
});

test('forwarded addresses require an explicitly trusted peer and are read from right to left', () => {
  const trusted = trustedProxies('127.0.0.1, ::1, 192.0.2.1');
  const request = (peer, chain) => ({ socket: { remoteAddress: peer }, headers: { 'x-forwarded-for': chain } });
  assert.equal(clientAddress(request('198.51.100.1', '203.0.113.1'), trusted), '198.51.100.1');
  assert.equal(clientAddress(request('::ffff:127.0.0.1', '203.0.113.1, 198.51.100.1'), trusted), '198.51.100.1');
  assert.equal(clientAddress(request('127.0.0.1', '203.0.113.1, 192.0.2.1'), trusted), '203.0.113.1');
  assert.throws(() => clientAddress(request('127.0.0.1', 'invalid'), trusted), { status: 400 });
  assert.throws(() => trustedProxies('0.0.0.0/0'), { status: 400 });
});

test('HTTPS login and logout cookies are Secure while SSH tunnel mode remains usable', () => {
  for (const value of [sessionCookie('fixture', 60, true), sessionCookie('', 0, true)]) {
    assert.match(value, /; Secure$/); assert.match(value, /HttpOnly; SameSite=Strict/);
  }
  assert.doesNotMatch(sessionCookie('fixture', 60, false), /Secure/);
});

test('password verification leaves the event loop responsive and kills timed-out children', { timeout: 3000 }, async () => {
  let child;
  const spawnProcess = () => {
    child = spawn(process.execPath, ['-e', 'process.stdin.resume(); setTimeout(() => process.exit(0), 100);'], { stdio: ['pipe', 'ignore', 'ignore'] });
    return child;
  };
  const result = verifyPassword('fixture', '/unused', { spawnProcess });
  let tick = false;
  await new Promise((resolve) => setImmediate(() => { tick = true; resolve(); }));
  assert.equal(tick, true); assert.equal(child.exitCode, null);
  assert.equal(await result, true);
  await assert.rejects(verifyPassword('fixture', '/unused', { spawnProcess, timeoutMs: 20 }), { status: 503 });
  assert.equal(child.signalCode, 'SIGKILL');
  await assert.rejects(verifyPassword('fixture', '/unused', {
    spawnProcess: () => spawn('/nonexistent-review-binary', [], { stdio: ['pipe', 'ignore', 'ignore'] }),
  }), { status: 503 });
});

const hasHtpasswd = !spawnSync('htpasswd', ['-h'], { stdio: 'ignore' }).error;
test('real htpasswd accepts the correct password and rejects an incorrect password', { skip: !hasHtpasswd }, async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'awg-auth-test-'));
  const file = path.join(directory, 'users');
  const password = crypto.randomBytes(24).toString('hex');
  try {
    const generated = spawnSync('htpasswd', ['-niBC', '4', 'admin'], { input: `${password}\n`, encoding: 'utf8' });
    assert.equal(generated.status, 0, 'fixture hash creation failed');
    fs.writeFileSync(file, generated.stdout, { mode: 0o600 });
    assert.equal(await verifyPassword(password, file), true);
    assert.equal(await verifyPassword(`${password}-wrong`, file), false);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
