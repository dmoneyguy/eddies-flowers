// In-memory sliding-window rate limit. Suitable for v1 Coming Soon traffic;
// not durable across server-instance restarts or multi-region (Vercel functions
// can run on multiple instances). For v2 if the waitlist sees real volume,
// swap to Vercel KV — the interface here is intentionally tiny so it's a 5-line swap.

type Bucket = { hits: number[]; createdAt: number };

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 5;
const SWEEP_MS = 5 * 60 * 1000; // periodic cleanup so the map doesn't grow forever

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < SWEEP_MS) return;
  for (const [key, b] of buckets) {
    b.hits = b.hits.filter((t) => now - t < WINDOW_MS);
    if (b.hits.length === 0) buckets.delete(key);
  }
  lastSweep = now;
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key) ?? { hits: [], createdAt: now };
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);

  if (bucket.hits.length >= MAX_HITS) {
    const oldest = Math.min(...bucket.hits);
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: MAX_HITS - bucket.hits.length };
}
