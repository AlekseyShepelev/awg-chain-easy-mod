'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync, spawnSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

module.exports = async function exerciseFailover(api, upstream, primaryId) {
  const initial = await (await api('/api/routing')).json();
  assert.equal(initial.failover.config.enabled, false);
  const backup = await upstream('failover-backup', '10.99.0.2');
  const peer = await upstream('failover-peer', '10.99.0.3');
  const last = await upstream('failover-last', '10.99.0.4');
  const all = await (await api('/api/routing')).json();
  const primary = all.upstreams.find((item) => item.id === primaryId);
  const secondary = all.upstreams.find((item) => item.id === backup.id);
  const tertiary = all.upstreams.find((item) => item.id === peer.id);
  const finalBackup = all.upstreams.find((item) => item.id === last.id);
  const pool = [primary, secondary, tertiary, finalBackup];
  const binary = '/usr/local/bin/awg-chain-probe';
  const missing = spawnSync(binary, ['-interface', 'au-missing', '-mark', primary.mark, '-timeout', '1s', 'https://1.1.1.1/cdn-cgi/trace']);
  assert.equal(missing.status, 1, 'missing upstream must fail rather than probe through the main route');
  const outcome = (item, success) => fs.writeFileSync(`/tmp/failover-test-health-${item.mark}`, success ? '0' : '1');
  for (const item of pool) outcome(item, true);
  fs.renameSync(binary, `${binary}.test-original`);
  fs.writeFileSync(binary, '#!/bin/sh\nexit "$(cat /tmp/failover-test-health-$4 2>/dev/null || echo 1)"\n', { mode: 0o755 });
  let policy;
  const settings = { enabled: true, candidates: pool.map((item, index) => ({ upstreamId: item.id, priority: [10, 20, 21, 30][index] })), intervalSeconds: 5, timeoutSeconds: 1,
    failureThreshold: 2, recoveryThreshold: 2, autoFailback: false, targets: ['https://1.1.1.1/cdn-cgi/trace'] };
  async function waitFor(predicate, description) {
    for (let i = 0; i < 160; i++) {
      const snapshot = await (await api('/api/routing')).json();
      if (predicate(snapshot)) return snapshot;
      await delay(100);
    }
    assert.fail(description);
  }
  try {
    await api('/api/routing/failover', 'PUT', settings, 400);
    await api('/api/routing/default', 'PUT', { route: { type: 'upstream', upstreamId: primary.id } });
    await api('/api/routing/failover', 'PUT', { ...settings, candidates: [settings.candidates[0], settings.candidates[0]] }, 400);
    await api('/api/routing/failover', 'PUT', { ...settings, candidates: settings.candidates.slice(1) }, 400);
    await api('/api/routing/failover', 'PUT', { enabled: true, backupUpstreamId: backup.id });
    assert.deepEqual((await (await api('/api/routing')).json()).failover.config.candidates, settings.candidates.slice(0, 2), 'Old API settings should migrate to a priority pool');
    const migrated = JSON.parse(fs.readFileSync('/etc/wireguard/routing.json'));
    assert.equal(Object.hasOwn(migrated.failover, 'candidates'), false);
    assert.equal(Object.hasOwn(migrated.failover, 'backupUpstreamId'), false);
    assert.equal(migrated.upstreams[primary.id].failoverPriority, 10);
    assert.equal(migrated.upstreams[backup.id].failoverPriority, 20);
    policy = await (await api('/api/routing/policies', 'POST', { name: 'Failover policy isolation', priority: 7777,
      domains: ['failover-test.invalid'], networks: [], route: { type: 'upstream', upstreamId: primary.id } }, 201)).json();
    for (const candidate of settings.candidates) {
      await api(`/api/routing/upstreams/${candidate.upstreamId}/failover-priority`, 'PUT', { failoverPriority: candidate.priority });
    }
    const { candidates, ...monitorSettings } = settings;
    await api('/api/routing/failover', 'PUT', monitorSettings);
    await api(`/api/routing/upstreams/${primary.id}`, 'DELETE', undefined, 409);
    await api('/api/routing/default', 'PUT', { route: { type: 'direct' } }, 400);
    const set = `p_${policy.id.replace(/-/g, '').slice(0, 12)}`;
    execFileSync('nft', ['add', 'element', 'inet', 'awg_chain_easy', set, '{', '198.51.100.231', 'timeout', '120s', '}']);
    const beforeIndex = fs.readFileSync(`/sys/class/net/av${finalBackup.slot}/ifindex`, 'utf8');
    await api(`/api/routing/upstreams/${finalBackup.id}/failover-priority`, 'PUT', { failoverPriority: 40 });
    await api(`/api/routing/upstreams/${finalBackup.id}/failover-priority`, 'PUT', { failoverPriority: 30 });
    assert.equal(fs.readFileSync(`/sys/class/net/av${finalBackup.slot}/ifindex`, 'utf8'), beforeIndex);
    assert.match(execFileSync('nft', ['list', 'set', 'inet', 'awg_chain_easy', set], { encoding: 'utf8' }), /198\.51\.100\.231/, 'Priority editing must preserve learned DNS sets');
    const healthy = await waitFor((s) => Object.values(s.failover.health).every((h) => h.eligible), 'All four upstreams should pass recovery checks');
    assert.equal(Object.keys(healthy.failover.health).length, 4);
    assert.ok(Object.values(healthy.failover.health).every((h) => h.checkedAt && h.lastSuccessAt));
    outcome(primary, false);
    const switched = await waitFor((s) => s.effectiveDefaultRoute.upstreamId === backup.id, 'Primary failure should select a priority-20 backup');
    const chosen = pool.find((item) => item.id === switched.effectiveDefaultRoute.upstreamId);
    const other = [secondary, tertiary].find((item) => item.id !== chosen.id);
    assert.equal(switched.defaultRoute.upstreamId, primary.id, 'Configured primary must remain unchanged');
    assert.equal(switched.policies.find((p) => p.id === policy.id).route.upstreamId, primary.id);
    const rule = execFileSync('nft', ['list', 'chain', 'inet', 'awg_chain_easy', 'default_route'], { encoding: 'utf8' });
    assert.ok(rule.includes(`0x${Number(chosen.mark).toString(16).padStart(8, '0')}`), 'Kernel default mark should select backup');
    assert.match(execFileSync('nft', ['list', 'set', 'inet', 'awg_chain_easy', set], { encoding: 'utf8' }), /198\.51\.100\.231/);
    assert.equal(JSON.parse(fs.readFileSync('/etc/wireguard/routing.json')).failoverSelectedUpstreamId, chosen.id);
    await api('/api/routing/failover/preferred', 'POST', undefined, 409);
    outcome(chosen, false);
    await waitFor((s) => s.effectiveDefaultRoute.upstreamId === other.id, 'A second backup in the same group should take over');
    outcome(chosen, false); outcome(other, false);
    await waitFor((s) => s.effectiveDefaultRoute.upstreamId === finalBackup.id, 'The last backup group should take over');
    outcome(other, true);
    const manualRecovery = await waitFor((s) => s.failover.health[other.id].eligible, 'Priority-20 backup should recover');
    assert.equal(manualRecovery.effectiveDefaultRoute.upstreamId, finalBackup.id);
    await api('/api/routing/failover/preferred', 'POST');
    assert.equal((await (await api('/api/routing')).json()).effectiveDefaultRoute.upstreamId, other.id);
    outcome(primary, true);
    const recovered = await waitFor((s) => s.failover.health[primary.id].status === 'healthy', 'Primary should recover');
    assert.equal(recovered.effectiveDefaultRoute.upstreamId, other.id, 'Manual mode must stay on a healthy backup');
    // The old manual-return URL remains compatible with existing clients.
    await api('/api/routing/failover/primary', 'POST');
    assert.equal((await (await api('/api/routing')).json()).effectiveDefaultRoute.upstreamId, primary.id);
    for (const item of pool) outcome(item, false);
    await waitFor((s) => s.effectiveDefaultRoute.type === 'blocked', 'All failed upstreams must block default traffic');
    await api('/api/routing/failover', 'PUT', { autoFailback: true });
    outcome(finalBackup, true);
    await waitFor((s) => s.effectiveDefaultRoute.upstreamId === finalBackup.id, 'Recovered last backup should restore traffic');
    outcome(secondary, true);
    await waitFor((s) => s.effectiveDefaultRoute.upstreamId === backup.id, 'Automatic return should work between backup groups');
    outcome(primary, true);
    await waitFor((s) => s.effectiveDefaultRoute.upstreamId === primary.id && s.failover.health[primary.id].status === 'healthy', 'Automatic return should wait for primary recovery');
  } finally {
    await api('/api/routing/failover', 'PUT', { enabled: false, candidates: [] });
    await api('/api/routing/default', 'PUT', { route: { type: 'direct' } });
    if (policy) await api(`/api/routing/policies/${policy.id}`, 'DELETE');
    await api(`/api/routing/upstreams/${backup.id}`, 'DELETE');
    await api(`/api/routing/upstreams/${peer.id}`, 'DELETE');
    await api(`/api/routing/upstreams/${last.id}`, 'DELETE');
    fs.renameSync(`${binary}.test-original`, binary);
  }
};
