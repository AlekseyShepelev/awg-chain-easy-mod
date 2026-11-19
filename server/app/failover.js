'use strict';


const DEFAULTS = Object.freeze({
  enabled: false, candidates: [], intervalSeconds: 10, timeoutSeconds: 5,
  failureThreshold: 3, recoveryThreshold: 3, autoFailback: false,
  targets: ['https://1.1.1.1/cdn-cgi/trace', 'https://www.gstatic.com/generate_204'],
});

function invalid(message) { return Object.assign(new Error(message), { status: 400 }); }

function failoverPriority(value) {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < 1 || value > 10000) throw invalid('Failover priority must be an integer between 1 and 10000, or null to exclude the upstream');
  return value;
}

function priorityFromConfig(config) {
  const lines = config.split(/\r?\n/).filter((line) => /^\s*[#;]\s*FailoverPriority\b/i.test(line));
  if (lines.length > 1) throw invalid('Use only one FailoverPriority comment');
  if (!lines.length) return null;
  const match = lines[0].match(/^\s*[#;]\s*FailoverPriority\s*=\s*(\d*)\s*$/i);
  if (!match) throw invalid('Use # FailoverPriority = 20, or omit the comment to exclude the upstream');
  return failoverPriority(match[1] ? Number(match[1]) : null);
}

function withPriorityComment(config, value) {
  const priority = failoverPriority(value);
  const body = config.replace(/^[\t ]*[#;][\t ]*FailoverPriority\b[^\r\n]*(?:\r?\n|$)/gmi, '');
  const newline = config.includes('\r\n') ? '\r\n' : '\n';
  return priority === null ? body : `# FailoverPriority = ${priority}${newline}${body}`;
}

function failoverCandidates(state) {
  return Object.values(state.upstreams).flatMap((upstream) => {
    const priority = failoverPriority(upstream.failoverPriority);
    return priority === null ? [] : [{ upstreamId: upstream.id, priority }];
  });
}

function withFailoverConfig(state, config) {
  const { candidates, ...settings } = config;
  const priorities = new Map(candidates.map(({ upstreamId, priority }) => [upstreamId, priority]));
  return { ...state, failover: settings, upstreams: Object.fromEntries(Object.entries(state.upstreams)
    .map(([id, upstream]) => [id, { ...upstream, failoverPriority: priorities.get(id) ?? null }])) };
}

function migrateFailover(state) {
  const settings = state.failover || {};
  const legacy = Object.hasOwn(settings, 'candidates') || Object.hasOwn(settings, 'backupUpstreamId');
  const config = normalizeFailover(legacy ? settings : { ...settings, candidates: failoverCandidates(state) }, state);
  return withFailoverConfig(state, config);
}

function normalizeFailover(input, state) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalid('Failover settings must be an object');
  // Migrate the original primary/backup settings without changing the saved selection.
  if (Object.hasOwn(input, 'backupUpstreamId')) {
    if (Object.hasOwn(input, 'candidates')) throw invalid('Use candidates instead of backupUpstreamId');
    const { backupUpstreamId, ...settings } = input;
    if (backupUpstreamId !== null && (typeof backupUpstreamId !== 'string' || !Object.hasOwn(state.upstreams, backupUpstreamId))) throw invalid('Select an existing backup upstream');
    input = { ...settings, candidates: backupUpstreamId === null ? [] : [
      ...(state.defaultRoute.type === 'upstream' ? [{ upstreamId: state.defaultRoute.upstreamId, priority: 10 }] : []),
      ...(backupUpstreamId !== state.defaultRoute.upstreamId ? [{ upstreamId: backupUpstreamId, priority: 20 }] : []),
    ] };
  }
  const config = { ...DEFAULTS, ...input };
  for (const key of Object.keys(config)) if (!Object.hasOwn(DEFAULTS, key)) throw invalid(`Unknown failover setting: ${key}`);
  for (const key of ['enabled', 'autoFailback']) if (typeof config[key] !== 'boolean') throw invalid(`${key} must be a boolean`);
  for (const [key, min, max] of [['intervalSeconds', 5, 300], ['timeoutSeconds', 1, 30], ['failureThreshold', 1, 20], ['recoveryThreshold', 1, 20]]) {
    if (!Number.isInteger(config[key]) || config[key] < min || config[key] > max) throw invalid(`${key} must be an integer between ${min} and ${max}`);
  }
  if (config.timeoutSeconds > config.intervalSeconds) throw invalid('Probe timeout must not exceed the check interval');
  if (!Array.isArray(config.targets) || config.targets.length < 1 || config.targets.length > 3) throw invalid('Configure one to three HTTPS probe URLs');
  config.targets = [...new Set(config.targets.map((value) => {
    if (typeof value !== 'string' || value.length > 2048) throw invalid('Probe targets must be HTTPS URLs of at most 2048 characters');
    let url;
    try { url = new URL(value); } catch (_) { throw invalid('Invalid HTTPS probe URL'); }
    if (url.protocol !== 'https:' || !url.hostname || url.hostname.includes(':') || url.username || url.password || url.hash) {
      throw invalid('Probe URLs must use HTTPS with an IPv4 address or hostname, without credentials or fragments');
    }
    return url.href;
  }))];
  if (!Array.isArray(config.candidates) || config.candidates.length > 8) throw invalid('Configure up to eight failover candidates');
  const ids = new Set();
  config.candidates = config.candidates.map((candidate) => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)
      || Object.keys(candidate).some((key) => !['upstreamId', 'priority'].includes(key))) throw invalid('Each candidate needs an upstreamId and priority');
    const { upstreamId, priority } = candidate;
    if (typeof upstreamId !== 'string' || !Object.hasOwn(state.upstreams, upstreamId)) throw invalid('Select an existing candidate upstream');
    if (ids.has(upstreamId)) throw invalid('Each upstream may appear only once in failover candidates');
    if (!Number.isInteger(priority) || priority < 1 || priority > 10000) throw invalid('Failover priority must be an integer between 1 and 10000');
    ids.add(upstreamId);
    return { upstreamId, priority };
  });
  return config;
}

class FailoverState {
  constructor(config, defaultId, selectedId, now = Date.now()) {
    this.config = config;
    this.priorities = new Map(config.candidates.map(({ upstreamId, priority }) => [upstreamId, priority]));
    this.ids = [...this.priorities.keys()];
    const preferred = this.bestGroup(this.ids);
    this.selectedId = this.ids.includes(selectedId) ? selectedId : preferred.includes(defaultId) ? defaultId : this.pick(preferred);
    this.startedAt = now;
    this.maxAgeMs = (config.intervalSeconds * 2 + config.timeoutSeconds) * 1000;
    this.health = new Map(this.ids.map((id) => [id, { healthy: null, successes: 0, failures: 0, checkedAt: null, lastSuccessAt: null, available: false }]));
  }

  bestGroup(ids) {
    const priority = Math.min(...ids.map((id) => this.priorities.get(id)));
    return ids.filter((id) => this.priorities.get(id) === priority);
  }

  pick(ids) { return ids[Math.floor(Math.random() * ids.length)]; }

  fresh(id, now = Date.now()) {
    const checkedAt = this.health.get(id)?.checkedAt;
    return checkedAt !== null && checkedAt !== undefined && now - Date.parse(checkedAt) <= this.maxAgeMs;
  }

  eligible(id, now = Date.now()) {
    const health = this.health.get(id);
    return health?.available && health.healthy === true && health.successes > 0 && this.fresh(id, now);
  }

  usable(now = Date.now()) {
    const health = this.health.get(this.selectedId);
    return health?.healthy !== false && (health?.checkedAt ? this.fresh(this.selectedId, now) : now - this.startedAt <= this.maxAgeMs);
  }

  preferredCandidates(now = Date.now(), isAvailable = () => true) {
    return this.bestGroup(this.ids.filter((id) => this.eligible(id, now) && isAvailable(id)
      && this.priorities.get(id) < this.priorities.get(this.selectedId)));
  }

  record(id, { success, available = true }, now = Date.now()) {
    const health = this.health.get(id);
    if (!this.fresh(id, now)) {
      health.successes = 0;
      health.failures = 0;
      if (health.checkedAt) health.healthy = false;
    }
    health.available = available;
    health.checkedAt = new Date(now).toISOString();
    if (success && available) health.lastSuccessAt = health.checkedAt;
    health.successes = success && available ? Math.min(this.config.recoveryThreshold, health.successes + 1) : 0;
    health.failures = success && available ? 0 : Math.min(this.config.failureThreshold, health.failures + 1);
    if (!available || health.failures >= this.config.failureThreshold) health.healthy = false;
    if (health.successes >= this.config.recoveryThreshold) health.healthy = true;
  }

  choose(now = Date.now()) {
    const candidates = !this.usable(now)
      ? this.bestGroup(this.ids.filter((id) => this.eligible(id, now)))
      : this.config.autoFailback ? this.preferredCandidates(now) : [];
    if (candidates.length) this.selectedId = this.pick(candidates);
    return this.selectedId;
  }

  route(isAvailable, now = Date.now()) {
    return isAvailable(this.selectedId) && this.usable(now)
      ? { type: 'upstream', upstreamId: this.selectedId } : { type: 'blocked' };
  }

  snapshot(now = Date.now()) {
    return Object.fromEntries([...this.health].map(([id, health]) => [id, { ...health,
      eligible: this.eligible(id, now),
      status: !health.checkedAt ? 'checking' : !health.available ? 'unavailable' : !this.fresh(id, now) ? 'stale'
        : health.healthy === null ? 'checking' : health.healthy ? 'healthy' : 'unhealthy',
    }]));
  }
}

function probeUpstream(upstream, config, dnsUpstream, signal, network) {
  return new Promise((resolve) => {
    try {
      const child = network.spawn('/usr/local/bin/awg-chain-probe', [
        '-interface', upstream.interface, '-mark', upstream.mark, '-dns', dnsUpstream,
        '-timeout', `${config.timeoutSeconds}s`, ...config.targets,
      ], { signal, timeout: config.timeoutSeconds * 1000 + 1000, killSignal: 'SIGKILL' });
      child.once('error', () => resolve({ success: false, available: false }));
      child.once('close', (code) => resolve({ success: code === 0, available: true }));
    } catch (_) { resolve({ success: false, available: false }); }
  });
}

module.exports = { DEFAULTS, normalizeFailover, FailoverState, probeUpstream,
  failoverPriority, priorityFromConfig, withPriorityComment, failoverCandidates, withFailoverConfig, migrateFailover };
