'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const dgram = require('node:dgram');
const { RoutingManager } = require('/app/routing');
const { probeUpstream } = require('/app/failover');

module.exports = async function production(h) {
  const { step, command, ip, inNs, launch, eventually, pair, profile, daemon, configure, address,
    handshake, request, transportOutage, directCount, fixture } = h;
  const createManager = () => {
    const manager = new RoutingManager({ inboundInterfaces: ['awg3'], downstreamNetworks: ['10.8.3.0/24'],
      downstreamAddresses: () => ['10.8.3.1', '10.8.3.2'], mtu: 1280, dnsUpstream: '203.0.113.53',
      dnsTtlMin: 30, dnsTtlMax: 86400, inboundPorts: [53, 51820], upstreamPorts: [54323, 54324, 54325] });
    // Drive real monitor rounds deterministically; the live API suite covers scheduling.
    manager.scheduleFailover = () => {};
    return manager;
  };
  let routing = createManager();
  h.registerCleanup(async () => { await routing.shutdown(); });
  const items = {};
  const stored = {};
  const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const runtime = (id) => routing.runtime.get(items[id].id);
  const check = () => routing.checkFailover(routing.failoverGeneration);
  const probe = async (id) => (await probeUpstream(items[id], { timeoutSeconds: 2, targets: ['https://health.test/'] },
    '203.0.113.53', undefined, runtime(id).network)).success;
  const recovered = async (id) => {
    await eventually(() => handshake(items[id].interface) > 0, `remote-initiated application ${id} handshake`, 25_000);
    await eventually(() => probe(id), `application upstream ${id} recovery`, 25_000);
    if (routing.failover) await check();
  };
  function ownedProcesses() {
    return fs.readdirSync('/proc').filter((pid) => /^\d+$/.test(pid)).filter((pid) => {
      try { return fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8').includes('/app/namespace-holder.js'); }
      catch (_) { return false; }
    }).sort();
  }

  await step('production manager imports duplicate /32 and /24 addresses with unchanged profiles', async () => {
    command('nft', ['delete', 'chain', 'inet', 'proof', 'classify']);
    await routing.load();
    await routing.startAll();
    for (const [id, index, rootIP, exitIP, port] of [
      ['A', 0, '172.30.0.1', '172.30.0.2', 54323], ['B', 1, '172.30.0.5', '172.30.0.6', 54324],
    ]) {
      const identity = pair();
      const text = profile(identity, 'left', `10.8.3.2/${index ? 24 : 32}`, port, '0.0.0.0/0', `${exitIP}:55000`);
      items[id] = await routing.addUpstream({ name: `integration-${id}`, config: text });
      const item = items[id];
      assert.equal(fs.readFileSync(routing.configPath(item.id), 'utf8') === text, true, 'Import must preserve all profile bytes');
      stored[id] = digest(routing.configPath(item.id));
      assert.equal(handshake(item.interface), 0, 'Remote exit must initiate the first connection');
      await daemon(`exit${id.toLowerCase()}`, `exit${id}`);
      configure(`exit${id.toLowerCase()}`, profile(identity, 'right', '10.8.3.1/24', 55000, '10.8.3.2/32', `${rootIP}:${port}`, 1));
      address(`exit${id.toLowerCase()}`, `exit${id}`, '10.8.3.1/24');
      await eventually(() => handshake(item.interface) > 0, `reverse initiation ${id}`);
      const network = runtime(id).network;
      assert.equal(network.available(), true);
      assert.ok(network.identity !== fs.readlinkSync('/proc/self/ns/net'));
      assert.equal(fs.readlinkSync(`/proc/${runtime(id).child.pid}/ns/net`), fs.readlinkSync('/proc/self/ns/net'));
      assert.equal(Number(command('awg', ['show', item.interface, 'listen-port'])), port);
      await routing.setDefaultRoute({ type: 'upstream', upstreamId: item.id });
      assert.equal((await request(id)).source, '10.8.3.2');
      assert.equal(await probe(id), true);
      assert.equal(routing.upstreamStats(item).connectionStatus, 'connected');
    }
    assert.equal(ownedProcesses().length, 2);
    const count = JSON.parse(ip(null, ['-j', '-4', 'rule', 'show'])).length;
    await routing.reconcile();
    await routing.reconcile();
    assert.equal(JSON.parse(ip(null, ['-j', '-4', 'rule', 'show'])).length, count, 'Reconciliation must not duplicate policy rules');
    assert.equal(directCount(), 0);
  });

  await step('production transit allocation avoids a broad imported link-local subnet', async () => {
    const temporary = await routing.addUpstream({ name: 'transit-overlap', config: profile(pair(), 'left', '169.254.0.1/16', 54325, '0.0.0.0/0', '172.30.0.2:55001') });
    assert.ok(routing.runtime.get(temporary.id).network.transit.network.startsWith('100.64.'));
    await routing.deleteUpstream(temporary.id);
    assert.equal(ownedProcesses().length, 2);
  });

  await step('production policy routes and existing streams survive default-route changes', async () => {
    const policy = await routing.addPolicy({ name: 'Pinned B', priority: 10, domains: [], networks: ['203.0.113.11/32'],
      route: { type: 'upstream', upstreamId: items.B.id } });
    await routing.setDefaultRoute({ type: 'upstream', upstreamId: items.A.id });
    assert.equal(JSON.parse(inNs('client', 'node', [fixture, 'request', '203.0.113.11'])).exit, 'B');
    const stream = launch('node', [fixture, 'stream'], 'client');
    await eventually(() => stream.output.includes('A\n'), 'application stream on A');
    await routing.setDefaultRoute({ type: 'upstream', upstreamId: items.B.id });
    await request('B');
    const before = stream.output.length;
    await eventually(() => stream.output.length > before, 'existing application stream continues');
    assert.ok(stream.output.trim().split('\n').every((line) => line === 'A'));
    stream.kill('SIGTERM');
    assert.equal(routing.state.policies[policy.id].route.upstreamId, items.B.id);
    assert.equal(directCount(), 0);
  });

  await step('production monitor fails over and recovers from real UDP outages without direct leaks', async () => {
    await routing.setDefaultRoute({ type: 'upstream', upstreamId: items.A.id });
    await routing.setUpstreamPriority(items.A.id, 10);
    await routing.setUpstreamPriority(items.B.id, 20);
    await routing.setFailover({ enabled: true, intervalSeconds: 5, timeoutSeconds: 2, failureThreshold: 1,
      recoveryThreshold: 1, autoFailback: true, targets: ['https://health.test/'] });
    await check();
    assert.equal(routing.effectiveDefaultRoute().upstreamId, items.A.id);
    transportOutage(['A']);
    await check();
    assert.equal(routing.effectiveDefaultRoute().upstreamId, items.B.id);
    await request('B');
    transportOutage(['A', 'B']);
    await check();
    assert.equal(routing.effectiveDefaultRoute().type, 'blocked');
    assert.throws(() => inNs('client', 'node', [fixture, 'request']));
    transportOutage(['A']);
    await check();
    await request('B');
    transportOutage([]);
    await check();
    assert.equal(routing.effectiveDefaultRoute().upstreamId, items.A.id);
    await request('A');
    assert.equal(directCount(), 0);
  });

  await step('failed port changes restore the profile, namespace, and reverse listener', async () => {
    const occupied = dgram.createSocket('udp4');
    await new Promise((resolve) => occupied.bind(54325, '0.0.0.0', resolve));
    try {
      await assert.rejects(routing.setUpstreamListenPort(items.A.id, 54325), /Unable to update/);
    } finally { occupied.close(); }
    assert.equal(digest(routing.configPath(items.A.id)), stored.A);
    assert.equal(Number(command('awg', ['show', items.A.interface, 'listen-port'])), 54323);
    await recovered('A');
    await request('A');
    assert.equal(ownedProcesses().length, 2);
  });

  await step('failed import reconciliation removes the newly started namespace and profile', async () => {
    const apply = routing.applyNftScript.bind(routing);
    let once = true;
    routing.applyNftScript = (script) => {
      if (once) { once = false; return { status: 1, stderr: 'Injected nft failure' }; }
      return apply(script);
    };
    try {
      await assert.rejects(routing.addUpstream({ name: 'rollback', config: profile(pair(), 'left', '10.8.3.2/32', 54325,
        '0.0.0.0/0', '172.30.0.2:55001') }), /Unable to start upstream/);
    } finally { routing.applyNftScript = apply; }
    assert.equal(Object.keys(routing.state.upstreams).length, 2);
    assert.equal(fs.readdirSync('/etc/wireguard/upstreams').length, 2);
    assert.equal(ownedProcesses().length, 2);
    assert.ok(!JSON.parse(ip(null, ['-j', 'link'])).some((link) => link.ifname === 'av2'));
    await check();
    await request('A');
  });

  await step('unexpected namespace-holder exit withdraws the route and cleans both processes', async () => {
    const old = runtime('A');
    old.network.holder.kill('SIGKILL');
    await eventually(() => routing.runtime.get(items.A.id).status === 'error' && !old.network.available(), 'namespace failure status');
    await routing.operation;
    assert.ok(old.child.exitCode !== null || old.child.signalCode !== null);
    assert.equal(ownedProcesses().length, 1);
    await check();
    await request('B');
    await routing.setUpstreamEnabled(items.A.id, true);
    await recovered('A');
    await request('A');
    assert.equal(ownedProcesses().length, 2);
  });

  await step('manager restart preserves identities, profiles, priorities, policies, and selection', async () => {
    const before = fs.readFileSync('/etc/wireguard/routing.json', 'utf8');
    await routing.shutdown();
    assert.equal(ownedProcesses().length, 0);
    routing = createManager();
    await routing.load();
    await routing.startAll();
    assert.equal(fs.readFileSync('/etc/wireguard/routing.json', 'utf8'), before);
    for (const id of ['A', 'B']) assert.equal(digest(routing.configPath(items[id].id)), stored[id]);
    await recovered('A');
    await recovered('B');
    await request('A');
    assert.equal(JSON.parse(inNs('client', 'node', [fixture, 'request', '203.0.113.11'])).exit, 'B');
    assert.equal(ownedProcesses().length, 2);
  });

  await step('a vanished transit link blocks immediately and is unavailable to failover', async () => {
    ip(null, ['link', 'delete', runtime('A').network.device]);
    assert.match(ip(null, ['route', 'show', 'table', String(items.A.table)]), /prohibit default/);
    assert.throws(() => inNs('client', 'node', [fixture, 'request']));
    assert.equal(directCount(), 0);
    assert.equal(routing.upstreamStats(items.A).status, 'error');
    await routing.reconcile();
    await check();
    assert.equal(routing.failover.health.get(items.A.id).available, false);
    assert.equal(routing.effectiveDefaultRoute().upstreamId, items.B.id);
    await request('B');
    assert.equal(directCount(), 0);
  });
};
