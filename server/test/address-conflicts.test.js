'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawn, execFileSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const test = require('node:test');

test('isolated upstream addresses and client reservations through the live API', { timeout: 180_000 }, async (t) => {
  const password = crypto.randomBytes(24).toString('base64url');
  const passwordHash = execFileSync('node', ['/app/hash-password.js'], { input: password, encoding: 'utf8' }).trim();
  const service = spawn('/usr/local/bin/awg-chain-easy-entrypoint', [], {
    detached: true,
    env: { ...process.env, WG_HOST: '127.0.0.1', WG_PERSISTENT_KEEPALIVE: '0', PASSWORD_HASH: passwordHash },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  service.stdout.on('data', (data) => { output += data; });
  service.stderr.on('data', (data) => { output += data; });
  t.after(async () => {
    if (service.exitCode !== null || service.signalCode !== null) return;
    const closed = new Promise((resolve) => service.once('exit', resolve));
    process.kill(-service.pid, 'SIGTERM');
    const timeout = setTimeout(() => {
      try { process.kill(-service.pid, 'SIGKILL'); } catch (_) { /* Already exited. */ }
    }, 8000);
    timeout.unref();
    await closed;
    clearTimeout(timeout);
  });
  const base = 'http://127.0.0.1:51821';
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { ready = (await fetch(`${base}/api/health`)).ok; } catch (_) { /* Starting. */ }
    if (ready) break;
    if (service.exitCode !== null) break;
    await delay(100);
  }
  assert.ok(ready, 'isolated test service must become healthy');
  assert.ok(output.includes('Web UI listening'), 'service must complete startup');
  const login = await fetch(`${base}/api/session`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  async function api(url, method = 'GET', body, expected = 200) {
    const response = await fetch(`${base}${url}`, {
      method, headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    assert.equal(response.status, expected, `${method} ${url}: unexpected status`);
    return response;
  }
  async function create(name, protocol = 'AWG3') {
    return (await api('/api/wireguard/client', 'POST', { name, protocol }, 201)).json();
  }
  async function clients() { return (await api('/api/wireguard/client')).json(); }
  const fixture = await create('profile-fixture');
  const exported = await (await api(`/api/wireguard/client/${fixture.id}/configuration`)).text();
  const template = exported.replace(/^Endpoint = .+$/m, 'Endpoint = 127.0.0.1:59999');
  const profile = (address) => template.replace(/^Address = .+$/m, `Address = ${address}/32`);
  await api(`/api/wireguard/client/${fixture.id}`, 'DELETE');
  async function upstream(name, address, expected = 201) {
    return (await api('/api/routing/upstreams', 'POST', { name, config: profile(address) }, expected)).json();
  }

  let firstUpstream;
  let art;
  await t.test('upstream and client can use the same address without changing local allocation', async () => {
    firstUpstream = await upstream('first-upstream', '10.8.3.2');
    art = await create('art');
    const bol = await create('bol');
    const list = await clients();
    assert.equal(list.find((c) => c.id === art.id).address, '10.8.3.2');
    assert.equal(list.find((c) => c.id === bol.id).address, '10.8.3.3');
    await api(`/api/wireguard/client/${bol.id}`, 'DELETE');
    const recreated = await create('bol');
    assert.equal((await clients()).find((c) => c.id === recreated.id).address, '10.8.3.3');
  });

  await t.test('local client reservations remain unique when an upstream is disabled', async () => {
    await api(`/api/routing/upstreams/${firstUpstream.id}/disable`, 'POST');
    const created = await create('while-upstream-disabled');
    assert.notEqual((await clients()).find((c) => c.id === created.id).address, '10.8.3.2');
    await api(`/api/routing/upstreams/${firstUpstream.id}/enable`, 'POST');
  });

  await t.test('isolates imports matching server, client, and another upstream address', async () => {
    for (const address of ['10.8.3.1', '10.8.4.1', '10.8.5.1', '10.8.3.2', '10.8.3.3']) {
      const result = await upstream(`overlap-${address}`, address);
      const rootAddresses = JSON.parse(execFileSync('ip', ['-j', '-4', 'address', 'show'], { encoding: 'utf8' }));
      assert.ok(!rootAddresses.some((entry) => entry.ifname === result.interface));
      await api(`/api/routing/upstreams/${result.id}`, 'DELETE');
    }
    await api(`/api/wireguard/client/${art.id}/disable`, 'POST');
    const disabledOverlap = await upstream('disabled-client-overlap', '10.8.3.2');
    await api(`/api/routing/upstreams/${disabledOverlap.id}`, 'DELETE');
    await api(`/api/wireguard/client/${art.id}/enable`, 'POST');
  });

  await t.test('upstreams can overlap all inbound protocol pools', async () => {
    await upstream('awg2-pool', '10.8.4.2');
    await upstream('native-pool', '10.8.5.2');
    const legacy = await create('legacy', 'AWG2');
    const native = await create('native', 'WG');
    const list = await clients();
    assert.equal(list.find((c) => c.id === legacy.id).address, '10.8.4.2');
    assert.equal(list.find((c) => c.id === native.id).address, '10.8.5.2');
  });

  await t.test('concurrent client creation allocates unique addresses and names', async () => {
    await Promise.all(Array.from({ length: 6 }, (_, index) => create(`parallel-${index}`)));
    const list = await clients();
    assert.equal(new Set(list.map((c) => c.address)).size, list.length);
    const responses = await Promise.all(Array.from({ length: 2 }, () => fetch(`${base}/api/wireguard/client`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ name: 'same-name', protocol: 'AWG3' }),
    })));
    assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]);
  });

  await t.test('concurrent upstream import and client creation safely share an address', async () => {
    const used = new Set((await clients()).map((c) => c.address));
    used.add('10.8.3.2');
    let candidate;
    for (let index = 2; index < 255; index += 1) {
      if (!used.has(`10.8.3.${index}`)) { candidate = `10.8.3.${index}`; break; }
    }
    const responses = await Promise.all([
      fetch(`${base}/api/routing/upstreams`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ name: 'racing-upstream', config: profile(candidate) }) }),
      fetch(`${base}/api/wireguard/client`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ name: 'racing-client' }) }),
    ]);
    assert.equal(responses[1].status, 201);
    assert.equal(responses[0].status, 201);
    const client = (await clients()).find((c) => c.name === 'racing-client');
    assert.equal(client.address, candidate);
  });

  await t.test('unreadable disabled upstream does not affect independent client allocation', async () => {
    await api(`/api/routing/upstreams/${firstUpstream.id}/disable`, 'POST');
    const file = path.join('/etc/wireguard/upstreams', `${firstUpstream.id}.conf`);
    fs.renameSync(file, `${file}.test-backup`);
    try {
      await api('/api/wireguard/client', 'POST', { name: 'independent-allocation' }, 201);
    } finally { fs.renameSync(`${file}.test-backup`, file); }
    await api(`/api/routing/upstreams/${firstUpstream.id}/enable`, 'POST');
  });

  await t.test('an invalid stored config fails before creating namespace links', async () => {
    await api(`/api/routing/upstreams/${firstUpstream.id}/disable`, 'POST');
    const file = path.join('/etc/wireguard/upstreams', `${firstUpstream.id}.conf`);
    const original = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, '[Interface]\n', { mode: 0o600 });
    try {
      await api(`/api/routing/upstreams/${firstUpstream.id}/enable`, 'POST', undefined, 400);
      const addresses = JSON.parse(execFileSync('ip', ['-j', '-4', 'address', 'show'], { encoding: 'utf8' }));
      assert.ok(!addresses.some((entry) => ['au0', 'av0'].includes(entry.ifname)));
    } finally { fs.writeFileSync(file, original, { mode: 0o600 }); }
    await api(`/api/routing/upstreams/${firstUpstream.id}/enable`, 'POST');
  });

  await t.test('upstream priority comments import and export without restarting the tunnel', async () => {
    const post = (name, config, expected = 201) => api('/api/routing/upstreams', 'POST', { name, config }, expected);
    const original = profile('10.99.9.2');
    await post('invalid-priority', '# FailoverPriority = 10001\n' + original, 400);
    await post('duplicate-priority', '# FailoverPriority = 10\n# FailoverPriority = 20\n' + original, 400);
    let imported = await (await post('priority-comment', '# FailoverPriority = 15\n' + original)).json();
    const endpoint = (suffix) => `/api/routing/upstreams/${imported.id}/${suffix}`;
    const item = (await (await api('/api/routing')).json()).upstreams.find((upstream) => upstream.id === imported.id);
    assert.equal(item.failoverPriority, 15);
    const indexFile = `/sys/class/net/av${item.slot}/ifindex`;
    const index = fs.readFileSync(indexFile, 'utf8');
    assert.equal((await fetch(`${base}${endpoint('configuration')}`)).status, 401);
    await api(endpoint('failover-priority'), 'PUT', {}, 400);
    await api(endpoint('failover-priority'), 'PUT', { failoverPriority: '25' }, 400);
    await api(endpoint('configuration'), 'POST', undefined, 405);
    await api(endpoint('failover-priority'), 'PUT', { failoverPriority: 25 });
    assert.equal(fs.readFileSync(indexFile, 'utf8'), index, 'Priority edits must keep the original interface');
    const downloaded = await api(endpoint('configuration'));
    assert.equal(downloaded.headers.get('cache-control'), 'no-store');
    assert.match(downloaded.headers.get('content-disposition'), /attachment; filename="up-[a-f0-9]{8}\.conf"/);
    const portable = await downloaded.text();
    assert.ok(portable.startsWith('# FailoverPriority = 25\n'), 'Download should contain the current metadata priority');
    assert.ok(portable.replace(/^# FailoverPriority = 25\n/, '') === original, 'Download must preserve all VPN settings');
    const saved = JSON.parse(fs.readFileSync('/etc/wireguard/routing.json'));
    assert.equal(saved.upstreams[imported.id].failoverPriority, 25);
    assert.equal(Object.hasOwn(saved.failover, 'candidates'), false);
    await api(endpoint('failover-priority'), 'PUT', { failoverPriority: null });
    assert.ok(await (await api(endpoint('configuration'))).text() === original, 'Excluded exports must omit the priority comment');
    await api(`/api/routing/upstreams/${imported.id}`, 'DELETE');
    imported = await (await post('priority-round-trip', portable)).json();
    assert.equal((await (await api('/api/routing')).json()).upstreams.find((upstream) => upstream.id === imported.id).failoverPriority, 25);
    await api(endpoint('failover-priority'), 'PUT', { failoverPriority: null });
    await api(`/api/routing/upstreams/${imported.id}`, 'DELETE');
  });

  await t.test('default-route failover through the live API and kernel routing', async () => {
    await require('./failover-api')(api, upstream, firstUpstream.id);
  });

  await t.test('deleting an upstream preserves the client with the same address', async () => {
    await api(`/api/routing/upstreams/${firstUpstream.id}`, 'DELETE');
    const released = await create('released-address');
    assert.notEqual((await clients()).find((c) => c.id === released.id).address, '10.8.3.2');
    assert.equal((await clients()).find((c) => c.id === art.id).address, '10.8.3.2');
    assert.equal((await (await api('/api/health')).json()).status, 'healthy');
  });
});
