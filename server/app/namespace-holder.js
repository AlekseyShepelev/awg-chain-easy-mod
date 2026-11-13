'use strict';

// Keep a PID-addressable network namespace without privileged bind mounts.
// Closing the parent's pipe also releases the holder after an unexpected parent exit.
process.stdin.resume();
process.stdin.once('end', () => process.exit(0));
process.stdout.write('ready\n');
