'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { DEFAULTS, normalizeFailover, FailoverState, migrateFailover, failoverCandidates,
  failoverPriority, priorityFromConfig, withPriorityComment } = require('../app/failover');
const { RoutingManager } = require('../app/routing');

const state = () => ({ defaultRoute: { type: 'upstream', upstreamId: 'primary' },
  upstreams: { primary: { id: 'primary', enabled: true, mark: '0x201' }, backup: { id: 'backup', enabled: true, mark: '0x202' },
    peer: { id: 'peer', enabled: true, mark: '0x203' }, last: { id: 'last', enabled: true, mark: '0x204' } }, policies: {} });
const candidates = (priorities = [10, 20]) => ['primary', 'backup', 'peer', 'last'].slice(0, priorities.length)
  .map((upstreamId, index) => ({ upstreamId, priority: priorities[index] }));
const config = (extra = {}) => normalizeFailover({ enabled: true, candidates: candidates(), ...extra }, state());
const result = (machine, id, success, count = 1) => { for (let i = 0; i < count; i++) machine.record(id, { success }); machine.choose(); };

test('settings require distinct existing candidates and bounded priorities', () => {
  assert.deepEqual(normalizeFailover({}, state()), DEFAULTS);
  for (const upstreamId of ['missing', '__proto__']) assert.throws(() => config({ candidates: [{ upstreamId, priority: 1 }] }), /existing/);
  assert.throws(() => config({ candidates: [...candidates(), candidates()[0]] }), /only once/);
  assert.throws(() => config({ candidates: candidates().slice(0, 1) }), /at least two/);
  assert.throws(() => config({ candidates: candidates([10, 20, 30]).slice(1) }), /saved default/);
  for (const priority of [0, -1, 10001, 1.5, '10', null]) assert.throws(() => config({ candidates: candidates([priority, 20]) }), /integer/);
  for (const value of [null, {}, [null], [[]], [{ ...candidates()[0], extra: true }]]) assert.throws(() => config({ candidates: value }), /candidates|candidate/);
  assert.throws(() => normalizeFailover(config(), { ...state(), defaultRoute: { type: 'direct' } }), /default route/);
  assert.throws(() => config({ timeoutSeconds: 11 }), /interval/);
  assert.throws(() => config({ failureThreshold: 0 }), /failureThreshold/);
  assert.throws(() => config({ autoFailback: 'false' }), /boolean/);
  for (const target of ['http://example.com', 'https://user:password@example.com', 'https://example.com/#fragment', 'https://[::1]/']) {
    assert.throws(() => config({ targets: [target] }), /HTTPS|IPv4/);
  }
});

test('legacy primary/backup settings migrate to priorities 10/20 with selection and return mode retained', () => {
  for (const autoFailback of [false, true]) {
    const migrated = normalizeFailover({ enabled: true, backupUpstreamId: 'backup', autoFailback }, state());
    assert.deepEqual(migrated.candidates, candidates());
    assert.equal(migrated.autoFailback, autoFailback);
    assert.equal(Object.hasOwn(migrated, 'backupUpstreamId'), false);
    assert.equal(new FailoverState(migrated, 'primary', 'backup').selectedId, 'backup');
  }
  assert.deepEqual(normalizeFailover({ enabled: false, backupUpstreamId: null }, state()), DEFAULTS);
  assert.deepEqual(normalizeFailover({ enabled: false, backupUpstreamId: 'primary' }, state()).candidates, candidates().slice(0, 1));
  assert.throws(() => normalizeFailover({ enabled: true, backupUpstreamId: 'primary' }, state()), /at least two/);
  assert.throws(() => normalizeFailover({ enabled: true, backupUpstreamId: '__proto__' }, state()), /existing/);
});

test('failover tolerates transient failures and requires a proven backup', () => {
  const machine = new FailoverState(config(), 'primary');
  result(machine, 'primary', true, 3);
  result(machine, 'backup', true, 2);
  result(machine, 'primary', false, 2);
  assert.equal(machine.selectedId, 'primary');
  result(machine, 'primary', true);
  result(machine, 'primary', false, 3);
  assert.equal(machine.selectedId, 'primary');
  assert.deepEqual(machine.route(() => true), { type: 'blocked' });
  result(machine, 'backup', true);
  assert.equal(machine.selectedId, 'backup');
  assert.deepEqual(machine.route(() => true), { type: 'upstream', upstreamId: 'backup' });
});

test('manual return keeps a healthy backup selected; backup failure can still use the recovered primary', () => {
  const machine = new FailoverState(config(), 'primary', 'backup');
  result(machine, 'backup', true, 3);
  result(machine, 'primary', true, 3);
  assert.equal(machine.selectedId, 'backup');
  result(machine, 'backup', false, 3);
  assert.equal(machine.selectedId, 'primary');
});

test('automatic return waits for consecutive recovery successes', () => {
  const machine = new FailoverState(config({ autoFailback: true }), 'primary', 'backup');
  result(machine, 'backup', true, 3);
  result(machine, 'primary', true, 2);
  assert.equal(machine.selectedId, 'backup');
  result(machine, 'primary', false);
  result(machine, 'primary', true, 2);
  assert.equal(machine.selectedId, 'backup');
  result(machine, 'primary', true);
  assert.equal(machine.selectedId, 'primary');
});

test('failures select any healthy member of the best group; equal-priority recovery never switches', () => {
  const machine = new FailoverState(config({ candidates: candidates([10, 20, 20, 30]), autoFailback: true }), 'primary');
  machine.pick = (ids) => ids.at(-1);
  for (const id of machine.ids) result(machine, id, true, 3);
  result(machine, 'primary', false, 3);
  assert.equal(machine.selectedId, 'peer', 'Either priority-20 candidate is eligible, not the priority-30 candidate');
  for (let i = 0; i < 10; i++) machine.choose();
  assert.equal(machine.selectedId, 'peer', 'Checks must not rotate equal-priority candidates');
  result(machine, 'backup', false, 3);
  result(machine, 'backup', true, 3);
  assert.equal(machine.selectedId, 'peer', 'Same-priority recovery is sticky even with automatic return on');
  result(machine, 'peer', false, 3);
  assert.equal(machine.selectedId, 'backup');
  result(machine, 'backup', false, 3);
  assert.equal(machine.selectedId, 'last', 'Additional backup groups remain usable');
  result(machine, 'peer', true, 3);
  assert.equal(machine.selectedId, 'peer', 'Automatic return also works between backup groups');
});

test('first activation selects the lowest priority, while restarts retain a saved selection', () => {
  const options = config({ candidates: candidates([30, 10, 20]) });
  assert.equal(new FailoverState(options, 'primary').selectedId, 'backup');
  assert.equal(new FailoverState(options, 'primary', 'peer').selectedId, 'peer');
  assert.equal(new FailoverState(options, 'primary', 'removed').selectedId, 'backup');
});

test('stale checks and a last failed check cannot qualify a replacement; gaps reset recovery streaks', () => {
  const now = Date.now();
  const machine = new FailoverState(config({ candidates: candidates([10, 20, 30]) }), 'primary', 'primary', now);
  for (let i = 0; i < 3; i++) machine.record('backup', { success: true }, now);
  machine.record('primary', { success: false, available: false }, now);
  machine.record('backup', { success: false }, now);
  machine.choose(now);
  assert.equal(machine.selectedId, 'primary', 'A recently failed replacement is not eligible, even before its failure threshold');
  machine.record('backup', { success: true }, now);
  const later = now + machine.maxAgeMs + 1;
  machine.choose(later);
  assert.equal(machine.selectedId, 'primary');
  assert.equal(machine.snapshot(later).backup.status, 'stale');
  for (let i = 0; i < 2; i++) machine.record('backup', { success: true }, later);
  machine.choose(later);
  assert.equal(machine.selectedId, 'primary', 'A stale healthy candidate needs a new recovery streak');
  machine.record('backup', { success: true }, later);
  machine.choose(later);
  assert.equal(machine.selectedId, 'backup');
  assert.equal(machine.snapshot(later).backup.lastSuccessAt, new Date(later).toISOString());
  assert.deepEqual(machine.route(() => true, later + machine.maxAgeMs + 1), { type: 'blocked' });
});

test('both failed upstreams block default traffic and unavailable interfaces are never used', () => {
  const machine = new FailoverState(config(), 'primary');
  for (const id of machine.ids) machine.record(id, { success: false, available: false });
  machine.choose();
  assert.deepEqual(machine.route(() => true), { type: 'blocked' });
  result(machine, 'backup', true, 3);
  assert.equal(machine.selectedId, 'backup');
  assert.deepEqual(machine.route(() => false), { type: 'blocked' });
});

function manager() {
  const routing = new RoutingManager({ inboundInterfaces: ['awg3'], downstreamNetworks: ['10.8.3.0/24'], downstreamAddresses: () => [] });
  routing.state = migrateFailover({ ...state(), failover: config(), failoverSelectedUpstreamId: 'primary' });
  routing.stopping = true;
  routing.runtime = new Map([['primary', { status: 'up' }], ['backup', { status: 'up' }]]);
  routing.failover = new FailoverState(config(), 'primary');
  routing.appliedDefaultMark = '0x201';
  routing.save = async () => {};
  routing.applyNftScript = () => ({ status: 0 });
  return routing;
}

test('switching updates only the default chain, preserving policy sets and connection marks', async () => {
  const routing = manager();
  const scripts = [];
  routing.applyNftScript = (script) => { scripts.push(script); return { status: 0 }; };
  routing.failover.selectedId = 'backup';
  await routing.applyFailoverSelection('primary');
  assert.equal(routing.state.failoverSelectedUpstreamId, 'backup');
  assert.equal(routing.appliedDefaultMark, '0x202');
  assert.equal(scripts.length, 1);
  assert.match(scripts[0], /flush chain inet awg_chain_easy default_route/);
  assert.doesNotMatch(scripts[0], /flush table|delete set|conntrack/);
  const restarted = new FailoverState(config(), 'primary', routing.state.failoverSelectedUpstreamId);
  assert.equal(restarted.selectedId, 'backup');
});

test('an nft failure restores the saved selection and retries instead of reporting a successful switch', async () => {
  const routing = manager();
  routing.applyNftScript = () => ({ status: 1 });
  routing.failover.selectedId = 'backup';
  await assert.rejects(routing.applyFailoverSelection('primary'), /default route/);
  assert.equal(routing.state.failoverSelectedUpstreamId, 'primary');
  assert.equal(routing.failover.selectedId, 'primary');
  assert.equal(routing.appliedDefaultMark, '0x201');
});

test('manual return rejects unproven and stale candidates and accepts a recovered better priority', async () => {
  const routing = manager();
  routing.applyNftScript = () => ({ status: 0 });
  routing.failover.selectedId = 'backup';
  await assert.rejects(routing.returnToPreferred(), /recovery checks/);
  result(routing.failover, 'primary', true, 3);
  routing.failover.health.get('primary').checkedAt = new Date(Date.now() - 60000).toISOString();
  await assert.rejects(routing.returnToPreferred(), /recovery checks/);
  result(routing.failover, 'primary', true, 3);
  await routing.returnToPreferred();
  assert.equal(routing.failover.selectedId, 'primary');
  await assert.rejects(routing.returnToPreferred(), /higher-priority/);
});

test('editing priority or return options keeps health and selected peer; probe changes require fresh recovery', async () => {
  const routing = manager();
  routing.stopping = true;
  routing.reconcile = async () => {};
  routing.state.failoverSelectedUpstreamId = 'backup';
  routing.failover.selectedId = 'backup';
  result(routing.failover, 'backup', false, 3);
  await routing.setFailover({ candidates: candidates([10, 20, 20, 30]), autoFailback: true });
  assert.equal(routing.failover.selectedId, 'backup');
  assert.equal(routing.failover.health.get('backup').healthy, false, 'An edit must not resurrect an unhealthy selection');
  result(routing.failover, 'backup', true, 3);
  await routing.setFailover({ targets: ['https://example.com/'] });
  assert.equal(routing.failover.health.get('backup').healthy, null);
  assert.equal(routing.failover.health.get('backup').successes, 0);
  assert.equal(routing.failover.eligible('backup'), false);
  assert.equal(routing.effectiveDefaultRoute().upstreamId, 'backup', 'Keep a working selection during revalidation');
});

test('a settings persistence failure leaves the current monitor configuration and selection intact', async () => {
  const routing = manager();
  const previous = routing.state.failover;
  routing.save = async () => { throw new Error('Disk unavailable'); };
  await assert.rejects(routing.setFailover({ intervalSeconds: 20 }), /Disk unavailable/);
  assert.equal(routing.state.failover, previous);
  assert.equal(routing.state.failoverSelectedUpstreamId, 'primary');
  assert.equal(routing.failover.config.intervalSeconds, 10);
});

test('removing the active candidate blocks an untested replacement until recovery checks pass', async () => {
  const routing = manager();
  routing.stopping = true;
  routing.reconcile = async () => {};
  routing.state.failoverSelectedUpstreamId = 'backup';
  routing.failover.selectedId = 'backup';
  await routing.setFailover({ candidates: [{ upstreamId: 'primary', priority: 20 }, { upstreamId: 'peer', priority: 10 }] });
  routing.runtime.set('peer', { status: 'up' });
  assert.equal(routing.failover.selectedId, 'peer');
  assert.deepEqual(routing.effectiveDefaultRoute(), { type: 'blocked' });
  result(routing.failover, 'peer', true, 3);
  assert.deepEqual(routing.effectiveDefaultRoute(), { type: 'upstream', upstreamId: 'peer' });
});

test('prioritized tunnels can be removed while the saved default stays protected', async () => {
  const routing = manager();
  await assert.rejects(routing.setDefaultRoute({ type: 'upstream', upstreamId: 'peer' }), /saved default/);
  routing.state.failover.enabled = false;
  routing.stopUpstream = async () => {};
  routing.reconcile = async () => {};
  routing.configPath = () => '/dev/null/nonexistent-test-config';
  await assert.rejects(routing.deleteUpstream(routing.state.defaultRoute.upstreamId), /default route/);
  await routing.deleteUpstream('backup');
  assert.equal(Object.hasOwn(routing.state.upstreams, 'backup'), false);
  assert.equal(failoverCandidates(routing.state).some(item => item.upstreamId === 'backup'), false);
});

test('priority lists migrate into upstream metadata without changing selection, routing, or return mode', () => {
  for (const legacy of [config({ candidates: candidates([10, 20, 20, 30]), autoFailback: true }), { enabled: true, backupUpstreamId: 'backup', autoFailback: true }]) {
    const original = { ...state(), failover: legacy, failoverSelectedUpstreamId: 'backup' };
    const saved = JSON.stringify(original);
    const migrated = migrateFailover(original);
    assert.equal(JSON.stringify(original), saved, 'Migration must not partially mutate its input');
    assert.equal(Object.hasOwn(migrated.failover, 'candidates'), false);
    assert.equal(Object.hasOwn(migrated.failover, 'backupUpstreamId'), false);
    assert.equal(migrated.failoverSelectedUpstreamId, 'backup');
    assert.deepEqual(migrated.defaultRoute, original.defaultRoute);
    assert.deepEqual(failoverCandidates(migrated), normalizeFailover(legacy, original).candidates);
    assert.equal(migrated.failover.autoFailback, true);
    assert.deepEqual(migrateFailover(migrated), migrated, 'Migration is idempotent');
  }
  const fresh = migrateFailover(state());
  assert.equal(fresh.failover.enabled, false);
  assert.ok(Object.values(fresh.upstreams).every((upstream) => upstream.failoverPriority === null));
});

test('priority comments round-trip with strict validation and preserve all VPN config lines', () => {
  const body = '# Provider comment\r\n[Interface]\r\nAddress = 10.9.0.2/32\r\n\r\n[Peer]\r\nAllowedIPs = 0.0.0.0/0\r\n';
  const exported = withPriorityComment(body, 20);
  assert.equal(priorityFromConfig(exported), 20);
  assert.equal(withPriorityComment(exported, null), body);
  assert.equal(withPriorityComment(exported, 10), '# FailoverPriority = 10\r\n' + body);
  assert.equal(withPriorityComment(withPriorityComment(exported, 10), 10), withPriorityComment(exported, 10));
  assert.equal(priorityFromConfig(body), null);
  assert.equal(priorityFromConfig('# FailoverPriority =\n' + body), null);
  assert.equal(priorityFromConfig('; failoverpriority = 10000\n' + body), 10000);
  for (const value of ['0', '-1', '10001', '1.5', 'twenty', '20 extra']) {
    assert.throws(() => priorityFromConfig(`# FailoverPriority = ${value}\n${body}`), /priority|Priority/);
  }
  assert.throws(() => priorityFromConfig(exported + '# FailoverPriority = 20\n'), /only one/);
  assert.throws(() => priorityFromConfig('# FailoverPriority 20\n' + body), /Use #/);
  for (const value of ['', '20', false, [], {}]) assert.throws(() => failoverPriority(value), /integer/);
});

test('per-upstream priority saves metadata, retains health and selection, and never restarts tunnels', async () => {
  const routing = manager();
  routing.stopUpstream = routing.startUpstream = routing.reconcile = () => { throw new Error('Unexpected tunnel or full routing update'); };
  result(routing.failover, 'primary', true, 3);
  const health = routing.failover.health.get('primary');
  await Promise.all([routing.setUpstreamPriority('backup', 25), routing.setUpstreamPriority('peer', 25)]);
  assert.deepEqual(failoverCandidates(routing.state), candidates([10, 25, 25]));
  assert.equal(Object.hasOwn(routing.state.failover, 'candidates'), false);
  assert.equal(routing.failover.selectedId, 'primary');
  assert.deepEqual(routing.failover.health.get('primary'), health);
  await routing.setUpstreamPriority('peer', null);
  assert.equal(routing.state.upstreams.peer.failoverPriority, null);
  await assert.rejects(routing.setUpstreamPriority('backup', null), /at least two/);
  await assert.rejects(routing.setUpstreamPriority('primary', null), /at least two|saved default/);
  await assert.rejects(routing.setUpstreamPriority('missing', 20), /not found/);
  await assert.rejects(routing.setUpstreamPriority('backup', 10001), /integer/);
  assert.equal(routing.state.upstreams.backup.failoverPriority, 25);
});

test('failed priority persistence or route application restores metadata, selection, and monitor', async () => {
  const routing = manager();
  const original = routing.state;
  routing.save = async () => { throw new Error('Disk unavailable'); };
  await assert.rejects(routing.setUpstreamPriority('backup', 30), /Disk unavailable/);
  assert.equal(routing.state, original);
  routing.save = async () => {};
  routing.applyNftScript = () => ({ status: 1 });
  routing.appliedDefaultMark = '0x202';
  await assert.rejects(routing.setUpstreamPriority('backup', 30), /default route/);
  assert.equal(routing.state, original);
  assert.equal(routing.failover.selectedId, 'primary');
  assert.equal(routing.failover.priorities.get('backup'), 20);
});

test('downloads use metadata priority while preserving the original imported config', async (t) => {
  const fs = require('node:fs/promises');
  const os = require('node:os');
  const path = require('node:path');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'upstream-priority-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'upstream.conf');
  const original = '# FailoverPriority = 99\n[Interface]\nAddress = 10.9.0.2/32\n';
  await fs.writeFile(file, original);
  const routing = manager();
  routing.configPath = () => file;
  assert.equal(priorityFromConfig(await routing.exportUpstreamConfig('backup')), 20);
  routing.state.upstreams.backup.failoverPriority = null;
  assert.equal(await routing.exportUpstreamConfig('backup'), '[Interface]\nAddress = 10.9.0.2/32\n');
  assert.equal(await fs.readFile(file, 'utf8'), original);
  await assert.rejects(routing.exportUpstreamConfig('missing'), /not found/);
});

test('editing the saved default cannot bypass failed health or recovery checks', async () => {
  const routing = manager();
  routing.stopping = true;
  routing.reconcile = async () => {};
  result(routing.failover, 'backup', false, 3);
  await routing.setDefaultRoute({ type: 'upstream', upstreamId: 'backup' });
  assert.deepEqual(routing.effectiveDefaultRoute(), { type: 'blocked' });
  result(routing.failover, 'backup', true, 2);
  assert.deepEqual(routing.effectiveDefaultRoute(), { type: 'blocked' });
  result(routing.failover, 'backup', true);
  assert.equal(routing.effectiveDefaultRoute().upstreamId, 'backup');
});
