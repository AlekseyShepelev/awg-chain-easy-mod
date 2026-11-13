'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const crypto = require('node:crypto');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

function number(address) {
  const parts = address.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part) || Number(part) > 255)) throw new Error('Invalid IPv4 transit exclusion');
  return parts.reduce((value, part) => value * 256 + Number(part), 0);
}

function address(value) {
  return [24, 16, 8, 0].map((shift) => Math.floor(value / 2 ** shift) % 256).join('.');
}

function range(network) {
  const [host, prefixText = '32'] = network.split('/');
  const prefix = Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error('Invalid IPv4 transit exclusion');
  const size = 2 ** (32 - prefix);
  const start = Math.floor(number(host) / size) * size;
  return [start, start + size - 1];
}

function chooseTransit(exclusions) {
  const blocked = exclusions.map(range).sort((a, b) => a[0] - b[0]);
  for (const pool of ['169.254.0.0/16', '100.64.0.0/10', '172.16.0.0/12', '192.168.0.0/16', '10.0.0.0/8']) {
    const [start, end] = range(pool);
    let candidate = start;
    for (const [low, high] of blocked) {
      if (high < candidate) continue;
      if (low > candidate + 3) break;
      candidate = Math.ceil((high + 1) / 4) * 4;
      if (candidate + 3 > end) break;
    }
    if (candidate + 3 <= end) return { network: `${address(candidate)}/30`, router: address(candidate + 1), tunnel: address(candidate + 2) };
  }
  throw new Error('No non-overlapping private transit subnet is available for this upstream');
}

function run(program, args) {
  const result = spawnSync(program, args, { encoding: 'utf8', timeout: 10_000 });
  if (result.status !== 0) throw new Error(`Upstream network command failed: ${program} ${args[0] || ''}`);
  return result.stdout.trim();
}

function alive(child) {
  return Boolean(child?.pid && child.exitCode === null && child.signalCode === null);
}

async function stopProcess(child) {
  if (!alive(child)) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  child.kill('SIGTERM');
  await Promise.race([exited, delay(1500)]);
  if (alive(child)) {
    child.kill('SIGKILL');
    await Promise.race([exited, delay(1500)]);
  }
  if (alive(child)) throw new Error('Unable to stop owned upstream process');
}

class UpstreamNetwork {
  constructor(slot, transit, onFailure) {
    this.transit = transit;
    this.device = `av${slot}`;
    this.peer = `an${slot}`;
    this.onFailure = onFailure;
    this.children = new Set();
    this.stopping = false;
    this.holder = null;
    this.identity = null;
    this.ifindex = null;
    this.ownsDevice = false;
  }

  async create(mtu) {
    this.holder = spawn('unshare', ['-n', process.execPath, path.join(__dirname, 'namespace-holder.js')], { stdio: ['pipe', 'pipe', 'ignore'] });
    let ready = false;
    let failed = false;
    this.holder.stdout.on('data', (chunk) => { if (chunk.toString().includes('ready')) ready = true; });
    this.holder.on('error', () => { failed = true; this.failure('Unable to create upstream namespace; verify SYS_ADMIN capability'); });
    this.holder.on('exit', () => { failed = true; this.failure('Upstream namespace process exited'); });
    for (let attempt = 0; !ready && !failed && attempt < 50; attempt += 1) await delay(100);
    if (!ready || failed) throw new Error('Unable to create upstream namespace; verify SYS_ADMIN capability and namespace support');
    this.identity = fs.readlinkSync(`/proc/${this.holder.pid}/ns/net`);
    if (this.identity === fs.readlinkSync('/proc/self/ns/net')) throw new Error('Upstream namespace was not isolated');
    if (this.run('sysctl', ['-n', 'net.ipv4.ip_forward']) !== '1') {
      throw new Error('IPv4 forwarding is disabled in new network namespaces; enable forwarding on the Docker host and recreate the container');
    }
    this.run('ip', ['link', 'set', 'lo', 'up']);
    run('ip', ['link', 'add', this.device, 'type', 'veth', 'peer', 'name', this.peer]);
    this.ownsDevice = true;
    this.ifindex = JSON.parse(run('ip', ['-j', 'link', 'show', this.device]))[0].ifindex;
    run('ip', ['link', 'set', this.peer, 'netns', String(this.holder.pid)]);
    run('ip', ['address', 'add', `${this.transit.router}/30`, 'dev', this.device]);
    run('ip', ['link', 'set', this.device, 'mtu', String(mtu), 'up']);
    this.run('ip', ['address', 'add', `${this.transit.tunnel}/30`, 'dev', this.peer]);
    this.run('ip', ['link', 'set', this.peer, 'mtu', String(mtu), 'up']);
  }

  failure(message) { if (!this.stopping) this.onFailure(message); }

  available() {
    if (this.stopping || !alive(this.holder) || this.ifindex === null) return false;
    try {
      const base = `/sys/class/net/${this.device}`;
      return Number(fs.readFileSync(`${base}/ifindex`, 'utf8')) === this.ifindex
        && Boolean(Number(fs.readFileSync(`${base}/flags`, 'utf8')) & 1)
        && fs.readFileSync(`${base}/carrier`, 'utf8').trim() === '1';
    } catch (_) { return false; }
  }

  open() {
    if (this.stopping || !alive(this.holder)) throw new Error('Upstream namespace is unavailable');
    const target = `/proc/${this.holder.pid}/ns/net`;
    const fd = fs.openSync(target, 'r');
    // Pin the namespace descriptor across process creation rather than trusting a reusable PID.
    if (fs.readlinkSync(`/proc/self/fd/${fd}`) !== this.identity) {
      fs.closeSync(fd);
      throw new Error('Upstream namespace identity changed');
    }
    return fd;
  }

  run(program, args) {
    const fd = this.open();
    let result;
    try {
      result = spawnSync('nsenter', ['--net=/proc/self/fd/3', '--', program, ...args],
        { stdio: ['ignore', 'pipe', 'pipe', fd], encoding: 'utf8', timeout: 10_000 });
    } finally { fs.closeSync(fd); }
    if (result.status !== 0) throw new Error(`Upstream namespace command failed: ${program} ${args[0] || ''}`);
    return result.stdout.trim();
  }

  spawn(program, args, options = {}) {
    const fd = this.open();
    let child;
    try {
      child = spawn('nsenter', ['--net=/proc/self/fd/3', '--', program, ...args],
        { ...options, stdio: ['ignore', 'ignore', 'ignore', fd] });
    } finally { fs.closeSync(fd); }
    this.children.add(child);
    child.once('close', () => this.children.delete(child));
    return child;
  }

  async attach(device, tunnelAddress, mtu) {
    run('ip', ['link', 'set', device, 'netns', String(this.holder.pid)]);
    this.run('ip', ['-4', 'address', 'add', tunnelAddress, 'dev', device]);
    this.run('ip', ['link', 'set', device, 'mtu', String(mtu), 'up']);
    this.run('ip', ['-4', 'route', 'replace', 'prohibit', 'default', 'metric', '32760']);
    this.run('ip', ['-4', 'route', 'replace', 'default', 'dev', device, 'metric', '10']);
    const file = `/tmp/upstream-nft-${crypto.randomBytes(8).toString('hex')}`;
    await fsp.writeFile(file, `table ip upstream_nat {\n chain source_nat {\n type nat hook postrouting priority 100; policy accept;\n ip saddr ${this.transit.router} oifname "${device}" masquerade\n }\n}\n`, { mode: 0o600 });
    try { this.run('nft', ['-f', file]); } finally { await fsp.unlink(file); }
  }

  async destroy() {
    this.stopping = true;
    await Promise.all([...this.children].map(stopProcess));
    if (this.ownsDevice) {
      const result = spawnSync('ip', ['-j', 'link', 'show', this.device], { encoding: 'utf8' });
      if (result.status === 0 && (this.ifindex === null || JSON.parse(result.stdout)[0]?.ifindex === this.ifindex)) run('ip', ['link', 'delete', this.device]);
    }
    await stopProcess(this.holder);
  }
}

module.exports = { UpstreamNetwork, chooseTransit, stopProcess, alive };
