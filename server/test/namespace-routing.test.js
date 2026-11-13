'use strict';

// Reuse the isolated WAN/client/HTTPS fixture, with the real application manager.
process.env.NAMESPACE_INTEGRATION = '1';
require('./namespace-proof/proof');
