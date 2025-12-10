type Rec = { times: number[] };

type Kind = 'post' | 'comment';

type Store = Map<string, { post: Rec; comment: Rec }>;

const g = globalThis as unknown as { __rl?: Store };
const store: Store = g.__rl ?? new Map();
if (!g.__rl) g.__rl = store;

function now() { return Date.now(); }
function prune(rec: Rec, windowMs: number) {
  const cutoff = now() - windowMs;
  rec.times = rec.times.filter(t => t > cutoff);
}

export function checkRate(deviceId: string, kind: Kind): { ok: boolean; reason?: string } {
  let entry = store.get(deviceId);
  if (!entry) { entry = { post: { times: [] }, comment: { times: [] } }; store.set(deviceId, entry); }
  const rec = entry[kind];

  // Windows
  if (kind === 'post') {
    prune(rec, 60_000); // 1 min
    if (rec.times.length >= 1) return { ok: false, reason: 'minutely' };
    prune(rec, 3_600_000); // 1 hr
    if (rec.times.length >= 10) return { ok: false, reason: 'hourly' };
  } else {
    prune(rec, 30_000); // 30s
    if (rec.times.length >= 1) return { ok: false, reason: 'burst' };
    prune(rec, 3_600_000); // 1 hr
    if (rec.times.length >= 20) return { ok: false, reason: 'hourly' };
  }

  rec.times.push(now());
  return { ok: true };
}
