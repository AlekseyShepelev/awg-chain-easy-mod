'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { chooseTransit } = require('../app/upstream-network');
const { probeUpstream } = require('../app/failover');

test('transit allocation avoids imported prefixes, downstream pools, and already allocated links', () => {
  assert.deepEqual(chooseTransit(['10.8.3.0/24']), { network: '169.254.0.0/30', router: '169.254.0.1', tunnel: '169.254.0.2' });
  assert.equal(chooseTransit(['169.254.0.2/24']).network, '169.254.1.0/30');
  assert.equal(chooseTransit(['169.254.0.0/30', '169.254.0.4/30']).network, '169.254.0.8/30');
  assert.equal(chooseTransit(['169.254.0.0/16', '100.64.0.0/10']).network, '172.16.0.0/30');
  assert.equal(chooseTransit(['0.0.0.0/1']).network, '169.254.0.0/30');
  assert.throws(() => chooseTransit(['0.0.0.0/0']), /No non-overlapping/);
});

test('health checks never fall back to the router namespace when isolation is missing', async () => {
  assert.deepEqual(await probeUpstream({ interface: 'au0', mark: '0x201' }, { timeoutSeconds: 1, targets: ['https://example.com/'] }, '1.1.1.1'),
    { success: false, available: false });
});
