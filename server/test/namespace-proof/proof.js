'use strict';

// Disposable networking experiment, never imported by the application.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const dgram = require('node:dgram');
const fs = require('node:fs');
const https = require('node:https');
const { spawn, spawnSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const test = require('node:test');
const { FailoverState } = require('/app/failover');

const cert = () => fs.readFileSync('/proof-pki/cert.pem');
const mode = process.argv[2];

if (mode === 'hold') {
  console.log('ready');
  setInterval(() => {}, 60_000);
} else if (mode === 'service') {
  const label = process.argv[3];
  let requests = 0;
  const server = https.createServer({ key: fs.readFileSync('/proof-pki/key.pem'), cert: cert() }, (req, res) => {
    requests += 1;
    if (req.url === '/stream') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      const tick = () => res.write(`${label}\n`);
      tick();
      const timer = setInterval(tick, 100);
      req.on('close', () => clearInterval(timer));
    } else {
      res.end(JSON.stringify({ exit: label, source: req.socket.remoteAddress, requests }));
    }
  });
  const dns = dgram.createSocket('udp4');
  dns.on('message', (query, remote) => {
    let end = 12;
    while (end < query.length && query[end] !== 0) end += query[end] + 1;
    end += 5;
    if (end > query.length) return;
    const answer = Buffer.from('c00c000100010000003c0004cb00710a', 'hex');
    const header = Buffer.from(query.subarray(0, 12));
    header.writeUInt16BE(0x8180, 2);
    header.writeUInt16BE(1, 4);
    header.writeUInt16BE(1, 6);
    header.writeUInt16BE(0, 8);
    header.writeUInt16BE(0, 10);
    dns.send(Buffer.concat([header, query.subarray(12, end), answer]), remote.port, remote.address);
  });
  server.listen(443, '0.0.0.0', () => dns.bind(53, '203.0.113.53', () => console.log('ready')));
} else if (mode === 'request' || mode === 'stream') {
  const req = https.get({ hostname: process.argv[3] || '203.0.113.10', servername: 'health.test', port: 443,
    path: mode === 'stream' ? '/stream' : '/', ca: cert(), agent: false }, (res) => {
    if (mode === 'stream') res.on('data', (data) => process.stdout.write(data));
    else {
      let body = '';
      res.on('data', (data) => { body += data; });
      res.on('end', () => console.log(body));
    }
  });
  req.setTimeout(2000, () => req.destroy(new Error('Request timed out')));
  req.on('error', () => { console.error('Test request failed'); process.exitCode = 1; });
} else {
  test('real AWG3 forwarding through isolated upstream namespaces', { timeout: 150_000 }, async (t) => {
    const children = [];
    const holders = [];
    const namespaces = new Map();
    const work = fs.mkdtempSync('/tmp/awg-namespace-proof-');
    let applicationCleanup = async () => {};
    fs.chmodSync(work, 0o700);
    async function step(name, action) {
      let failed = false;
      await t.test(name, async () => {
        try { await action(); } catch (error) { failed = true; throw error; }
      });
      if (failed) throw new Error('Stopping dependent checks after failed prerequisite');
    }

    function command(program, args = [], input) {
      const result = spawnSync(program, args, { input, encoding: 'utf8', timeout: 10_000 });
      // Do not include configuration input or command output in errors: it may contain keys.
      if (result.status !== 0) {
        const diagnostic = ['ip', 'nft', 'sysctl'].includes(program)
          || (program === 'nsenter' && ['ip', 'nft', 'sysctl'].includes(args[3])) ? `: ${result.stderr.trim()}` : '';
        throw new Error(`Test command failed: ${program} ${args.join(' ')} (status ${result.status})${diagnostic}`);
      }
      return result.stdout.trim();
    }
    function inNs(name, program, args = [], input) {
      return command('nsenter', ['-t', String(namespaces.get(name).pid), '-n', program, ...args], input);
    }
    function ip(name, args) { return name ? inNs(name, 'ip', args) : command('ip', args); }
    function nft(name, script) {
      const file = `${work}/rules-${crypto.randomBytes(4).toString('hex')}.nft`;
      fs.writeFileSync(file, `${script}\n`, { mode: 0o600 });
      try {
        return name ? inNs(name, 'nft', ['-f', file]) : command('nft', ['-f', file]);
      } finally { fs.unlinkSync(file); }
    }
    function launch(program, args, namespace, holder = false) {
      const child = namespace
        ? spawn('nsenter', ['-t', String(namespaces.get(namespace).pid), '-n', program, ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
        : spawn(program, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      child.output = '';
      child.stdout.on('data', (data) => { child.output += data; });
      // Daemon stderr is intentionally not persisted or printed.
      child.stderr.resume();
      (holder ? holders : children).push(child);
      return child;
    }
    async function eventually(check, description, timeout = 12_000) {
      const end = Date.now() + timeout;
      while (Date.now() < end) {
        if (await check()) return;
        await delay(100);
      }
      throw new Error(`Timed out: ${description}`);
    }
    async function stop(child) {
      if (child.exitCode !== null || child.signalCode !== null) return;
      child.kill('SIGTERM');
      const end = Date.now() + 2500;
      while (child.exitCode === null && child.signalCode === null && Date.now() < end) await delay(25);
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
        await eventually(() => child.exitCode !== null || child.signalCode !== null, 'owned process exit', 3000);
      }
    }
    async function namespace(name) {
      const child = launch('unshare', ['-n', 'node', __filename, 'hold'], null, true);
      namespaces.set(name, child);
      await eventually(() => child.output.includes('ready'), `namespace ${name}`);
      ip(name, ['link', 'set', 'lo', 'up']);
      assert.equal(inNs(name, 'sysctl', ['-n', 'net.ipv4.ip_forward']), '1', 'Proof namespaces require IPv4 forwarding');
    }
    function veth(name, rootDevice, peerDevice, rootAddress, peerAddress) {
      ip(null, ['link', 'add', rootDevice, 'type', 'veth', 'peer', 'name', peerDevice]);
      ip(null, ['link', 'set', peerDevice, 'netns', String(namespaces.get(name).pid)]);
      ip(null, ['address', 'add', rootAddress, 'dev', rootDevice]);
      ip(null, ['link', 'set', rootDevice, 'up']);
      ip(name, ['address', 'add', peerAddress, 'dev', peerDevice]);
      ip(name, ['link', 'set', peerDevice, 'up']);
    }
    function keys() {
      const privateKey = command('awg', ['genkey']);
      return { privateKey, publicKey: command('awg', ['pubkey'], `${privateKey}\n`) };
    }
    function pair() {
      return { left: keys(), right: keys(), psk: command('awg', ['genpsk']), header: command('awg', ['genkey']) };
    }
    function profile(pairValue, side, address, port, allowed, endpoint, keepalive = 0) {
      const own = pairValue[side];
      const peer = pairValue[side === 'left' ? 'right' : 'left'];
      return `[Interface]\nAddress = ${address}\nPrivateKey = ${own.privateKey}\nListenPort = ${port}\nMTU = 1280\n` +
        `Jc = 4\nJmin = 64\nJmax = 128\nS1 = 64\nS2 = 56\nS3 = 32\nS4 = 16\nH1 = 100000001-100000101\nH2 = 1100000001-1100000101\nH3 = 2100000001-2100000101\nH4 = 3100000001-3100000101\nHeaderProtectionKey = ${pairValue.header}\nContentPaddingAddition = 0-32\n` +
        `\n[Peer]\nPublicKey = ${peer.publicKey}\nPresharedKey = ${pairValue.psk}\nAllowedIPs = ${allowed}\n${endpoint ? `Endpoint = ${endpoint}\n` : ''}PersistentKeepalive = ${keepalive}\n`;
    }
    async function daemon(device, namespaceName) {
      const child = launch('amneziawg-go', ['-f', device], namespaceName);
      await eventually(() => fs.existsSync(`/var/run/amneziawg/${device}.sock`), `AWG socket ${device}`);
      return child;
    }
    function configure(device, text) {
      const file = `${work}/${device}.conf`;
      fs.writeFileSync(file, text, { mode: 0o600 });
      const stripped = command('awg-quick', ['strip', file]);
      const setconf = `${work}/${device}-set.conf`;
      fs.writeFileSync(setconf, `${stripped}\n`, { mode: 0o600 });
      command('awg', ['setconf', device, setconf]);
      return { file, sha: crypto.createHash('sha256').update(text).digest('hex') };
    }
    function address(device, namespaceName, value) {
      ip(namespaceName, ['address', 'add', value, 'dev', device]);
      ip(namespaceName, ['link', 'set', device, 'mtu', '1280', 'up']);
    }
    function handshake(device) {
      return Number(command('awg', ['show', device, 'latest-handshakes']).split(/\s+/)[1]) || 0;
    }
    async function request(expected, namespaceName = 'client') {
      const result = inNs(namespaceName, 'node', [__filename, 'request']);
      const body = JSON.parse(result);
      assert.equal(body.exit, expected);
      return body;
    }
    function applySelection(id) {
      const mark = id === 'A' ? '0x201' : id === 'B' ? '0x202' : '0x2ff';
      nft(null, `flush chain inet proof default_route\nadd rule inet proof default_route meta mark set ${mark} ct mark set meta mark\n`);
    }
    function transportOutage(ids) {
      const rules = ['flush chain inet proof transport_in', 'flush chain inet proof transport_out'];
      for (const id of ids) {
        const port = id === 'A' ? 54323 : 54324;
        rules.push(`add rule inet proof transport_in udp dport ${port} drop`);
        rules.push(`add rule inet proof transport_out udp sport ${port} drop`);
      }
      nft(null, rules.join('\n'));
    }
    async function probe(id) {
      const index = id === 'A' ? 0 : 1;
      return await new Promise((resolve) => {
        const child = launch('/usr/local/bin/awg-chain-probe', ['-interface', `au${index}`, '-mark', `0x20${index + 1}`,
          '-dns', '203.0.113.53', '-timeout', '2s', 'https://health.test/'], `up${id}`);
        child.on('close', (code) => resolve(code === 0));
      });
    }
    function directCount() {
      const state = JSON.parse(command('nft', ['-j', 'list', 'counter', 'inet', 'proof', 'direct_leaks']));
      return state.nftables.find((entry) => entry.counter)?.counter.packets || 0;
    }
    t.after(async () => {
      await applicationCleanup();
      for (const child of [...children].reverse()) await stop(child);
      for (const child of [...holders].reverse()) await stop(child);
      for (const dev of ['wanA', 'wanB', 'wanD', 'wanC', 'toA', 'toB', 'awg3']) {
        spawnSync('ip', ['link', 'delete', dev], { stdio: 'ignore' });
      }
      spawnSync('nft', ['delete', 'table', 'inet', 'proof'], { stdio: 'ignore' });
      fs.rmSync(work, { recursive: true, force: true });
      const links = JSON.parse(command('ip', ['-j', 'link']));
      assert.deepEqual(links.map((link) => link.ifname), ['lo']);
      assert.ok([...children, ...holders].every((child) => child.exitCode !== null || child.signalCode !== null));
      console.log('Cleanup verified: owned processes exited, virtual links removed, temporary keys removed.');
    });

    await step('build isolated exits, a real AWG3 client, and a reachable direct-path detector', async () => {
      command('ip', ['link', 'set', 'lo', 'up']);
      for (const name of ['exitA', 'exitB', 'direct', 'client', ...(process.env.NAMESPACE_INTEGRATION === '1' ? [] : ['upA', 'upB'])]) await namespace(name);
      veth('exitA', 'wanA', 'netA', '172.30.0.1/30', '172.30.0.2/30');
      veth('exitB', 'wanB', 'netB', '172.30.0.5/30', '172.30.0.6/30');
      veth('direct', 'wanD', 'netD', '198.18.1.1/30', '198.18.1.2/30');
      veth('client', 'wanC', 'netC', '192.0.2.1/30', '192.0.2.2/30');
      ip(null, ['route', 'add', 'default', 'via', '198.18.1.2']);
      for (const [name, label] of [['exitA', 'A'], ['exitB', 'B'], ['direct', 'DIRECT']]) {
        ip(name, ['address', 'add', '203.0.113.10/32', 'dev', 'lo']);
        ip(name, ['address', 'add', '203.0.113.11/32', 'dev', 'lo']);
        ip(name, ['address', 'add', '203.0.113.53/32', 'dev', 'lo']);
        const service = launch('node', [__filename, 'service', label], name);
        await eventually(() => service.output.includes('ready'), `HTTPS/DNS ${label}`);
      }
      ip('direct', ['route', 'add', 'default', 'via', '198.18.1.1']);
      const local = pair();
      await daemon('awg3');
      configure('awg3', profile(local, 'right', '10.8.3.1/24', 51820, '10.8.3.2/32'));
      address('awg3', null, '10.8.3.1/24');
      ip(null, ['route', 'add', '10.8.3.2/32', 'dev', 'awg3']);
      await daemon('clientwg', 'client');
      configure('clientwg', profile(local, 'left', '10.8.3.2/32', 51820, '0.0.0.0/0', '192.0.2.1:51820', 1));
      address('clientwg', 'client', '10.8.3.2/32');
      ip('client', ['route', 'add', 'default', 'dev', 'clientwg']);
      nft(null, `table inet proof {
        counter direct_leaks {}
        chain transport_in { type filter hook input priority -10; policy accept; }
        chain transport_out { type filter hook output priority -10; policy accept; }
        chain default_route { meta mark set 0x100 ct mark set meta mark; }
        chain classify { type filter hook prerouting priority -150; policy accept;
          iifname != "awg3" return
          meta mark set ct mark
          ct mark != 0 return
          jump default_route
        }
        chain enforce { type filter hook forward priority -10; policy accept;
          iifname "awg3" meta mark 0x2ff reject with icmp type admin-prohibited
          iifname "awg3" oifname "wanD" counter name direct_leaks
        }
        chain nat { type nat hook postrouting priority 100; policy accept;
          ip saddr 10.8.3.0/24 oifname "toA" snat ip to 169.254.100.1
          ip saddr 10.8.3.0/24 oifname "toB" snat ip to 169.254.100.5
          ip saddr 10.8.3.0/24 oifname "wanD" masquerade
        }
      }`);
      await eventually(() => handshake('awg3') > 0, 'downstream AWG3 handshake');
      await request('DIRECT');
      assert.ok(directCount() > 0, 'Direct path must actually work before testing leak prevention');
      command('nft', ['reset', 'counter', 'inet', 'proof', 'direct_leaks']);
    });

    if (process.env.NAMESPACE_INTEGRATION === '1') {
      await require('./production')({ step, command, ip, nft, inNs, launch, eventually, pair, profile, daemon, configure,
        address, handshake, request, transportOutage, directCount, fixture: __filename,
        registerCleanup: (action) => { applicationCleanup = action; } });
      return;
    }

    const upstreams = [];
    await step('move AWG3 TUN devices while retaining UDP sockets and reverse initiation', async () => {
      for (const [id, index, rootIP, exitIP, port] of [
        ['A', 0, '172.30.0.1', '172.30.0.2', 54323], ['B', 1, '172.30.0.5', '172.30.0.6', 54324],
      ]) {
        const data = pair();
        const device = `au${index}`;
        const peerDevice = `exit${id.toLowerCase()}`;
        const ns = `up${id}`;
        const rootTransit = `169.254.100.${index * 4 + 1}`;
        const innerTransit = `169.254.100.${index * 4 + 2}`;
        veth(ns, `to${id}`, `from${id}`, `${rootTransit}/30`, `${innerTransit}/30`);
        const text = profile(data, 'left', '10.8.3.2/32', port, '0.0.0.0/0', `${exitIP}:55000`);
        const child = await daemon(device);
        const original = configure(device, text);
        assert.equal(handshake(device), 0);
        ip(null, ['link', 'set', device, 'netns', String(namespaces.get(ns).pid)]);
        address(device, ns, '10.8.3.2/32');
        ip(ns, ['route', 'add', 'default', 'dev', device]);
        nft(ns, `table ip proof_nat {\n chain source_nat { type nat hook postrouting priority 100; policy accept; oifname "${device}" ip saddr ${rootTransit} masquerade; }\n}`);
        ip(null, ['rule', 'add', 'priority', String(11100 + index), 'fwmark', `0x20${index + 1}`, 'lookup', String(201 + index)]);
        ip(null, ['route', 'add', 'prohibit', 'default', 'metric', '32760', 'table', String(201 + index)]);
        ip(null, ['route', 'add', 'default', 'via', innerTransit, 'dev', `to${id}`, 'metric', '10', 'table', String(201 + index)]);
        await daemon(peerDevice, `exit${id}`);
        configure(peerDevice, profile(data, 'right', '10.8.3.1/24', 55000, '10.8.3.2/32', `${rootIP}:${port}`, 1));
        address(peerDevice, `exit${id}`, '10.8.3.1/24');
        await eventually(() => handshake(device) > 0, `reverse-initiated ${id} handshake`);
        assert.equal(Number(command('awg', ['show', device, 'listen-port'])), port);
        assert.ok(fs.readlinkSync(`/proc/${child.pid}/ns/net`) === fs.readlinkSync('/proc/self/ns/net'), 'Daemon UDP namespace must remain the router namespace');
        upstreams.push({ id, device, ns, peerDevice, port, child, original, text });
      }
      const local = JSON.parse(command('ip', ['-j', 'address']));
      assert.ok(!local.some((iface) => iface.addr_info.some((a) => a.local === '10.8.3.2')));
      for (const name of ['client', 'upA', 'upB']) {
        const interfaces = JSON.parse(ip(name, ['-j', 'address']));
        assert.ok(interfaces.some((iface) => iface.addr_info.some((a) => a.local === '10.8.3.2')));
      }
    });

    await step('both unchanged duplicate-address profiles forward real client HTTPS traffic', async () => {
      for (const id of ['A', 'B']) {
        applySelection(id);
        const body = await request(id);
        assert.equal(body.source, '10.8.3.2', 'Remote exit must see the original imported address');
        assert.equal(await probe(id), true, 'Production DNS and verified-TLS helper must work inside each namespace');
      }
      assert.equal(directCount(), 0);
    });

    await step('new flows switch exits while an established stream keeps its selected exit', async () => {
      applySelection('A');
      const stream = launch('node', [__filename, 'stream'], 'client');
      await eventually(() => stream.output.includes('A\n'), 'stream on A');
      applySelection('B');
      await request('B');
      const before = stream.output.length;
      await eventually(() => stream.output.length > before, 'existing stream continues after switch');
      assert.ok(stream.output.trim().split('\n').every((line) => line === 'A'));
      await stop(stream);
      assert.equal(directCount(), 0);
    });

    const selector = new FailoverState({ enabled: true, candidates: [{ upstreamId: 'A', priority: 10 }, { upstreamId: 'B', priority: 20 }],
      intervalSeconds: 5, timeoutSeconds: 2, failureThreshold: 1, recoveryThreshold: 1, autoFailback: true }, 'A');
    async function selectFromProbes() {
      const samples = await Promise.all(['A', 'B'].map(async (id) => ({ id, success: await probe(id) })));
      for (const { id, success } of samples) selector.record(id, { success, available: true });
      selector.choose();
      const route = selector.route(() => true);
      applySelection(route.type === 'upstream' ? route.upstreamId : null);
    }
    await step('real failed probes drive failover, complete outage blocks, and recovery restores preference', async () => {
      await selectFromProbes();
      assert.equal(selector.selectedId, 'A');
      transportOutage(['A']);
      await selectFromProbes();
      assert.equal(selector.selectedId, 'B');
      await request('B');
      transportOutage(['A', 'B']);
      await selectFromProbes();
      assert.equal(selector.route(() => true).type, 'blocked');
      applySelection(null);
      assert.throws(() => inNs('client', 'node', [__filename, 'request']));
      assert.equal(directCount(), 0);
      transportOutage(['A']);
      await selectFromProbes();
      assert.equal(selector.eligible('B'), true, 'Recovered B must pass the real probe');
      await request('B');
      transportOutage([]);
      await selectFromProbes();
      assert.equal(selector.selectedId, 'A');
      await request('A');
    });

    await step('administrative interface recovery reinstalls the namespace route', async () => {
      ip('upA', ['link', 'set', 'au0', 'down']);
      ip('upA', ['link', 'set', 'au0', 'up']);
      assert.doesNotMatch(ip('upA', ['route', 'show']), /^default/m, 'Linux removes the interface route on shutdown');
      assert.equal(await probe('A'), false, 'Missing route must not produce a false healthy result');
      ip('upA', ['route', 'replace', 'default', 'dev', 'au0']);
      assert.equal(await probe('A'), true);
      applySelection('A');
      await request('A');
    });

    await step('upstream restart preserves profile bytes and the reverse UDP port', async () => {
      const item = upstreams[0];
      const oldIndex = JSON.parse(ip(item.ns, ['-j', 'link', 'show', item.device]))[0].ifindex;
      await stop(item.child);
      await eventually(() => !fs.existsSync(`/var/run/amneziawg/${item.device}.sock`), 'old UAPI cleanup');
      item.child = await daemon(item.device);
      configure(item.device, item.text);
      ip(null, ['link', 'set', item.device, 'netns', String(namespaces.get(item.ns).pid)]);
      address(item.device, item.ns, '10.8.3.2/32');
      ip(item.ns, ['route', 'replace', 'default', 'dev', item.device]);
      assert.notEqual(JSON.parse(ip(item.ns, ['-j', 'link', 'show', item.device]))[0].ifindex, oldIndex);
      await eventually(() => handshake(item.device) > 0, 'reverse connection after restart', 20_000);
      assert.equal(Number(command('awg', ['show', item.device, 'listen-port'])), 54323);
      applySelection('A');
      await request('A');
      for (const upstream of upstreams) {
        assert.equal(crypto.createHash('sha256').update(fs.readFileSync(upstream.original.file)).digest('hex'), upstream.original.sha);
      }
    });

    await step('unexpected veth removal cannot fall through to the working direct route', async () => {
      applySelection('A');
      ip(null, ['link', 'delete', 'toA']);
      const routes = ip(null, ['route', 'show', 'table', '201']);
      assert.match(routes, /prohibit default/);
      assert.throws(() => inNs('client', 'node', [__filename, 'request']));
      assert.equal(directCount(), 0, 'A reachable direct exit must never receive default VPN traffic');
    });
  });
}
