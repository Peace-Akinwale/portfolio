// A small in-process limiter for the public write endpoints. The site runs as one
// long-lived `next start` process on Railway, so process memory is the shared
// store; a second instance would need a real store.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

// The client address as Railway's proxy reports it. The first X-Forwarded-For hop
// is whatever the client sent, so it is never used: X-Real-IP, then the last hop.
export function clientIp(request: Request): string {
  const real = request.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const hops = (request.headers.get('x-forwarded-for') ?? '').split(',').map((h) => h.trim()).filter(Boolean);
  return hops[hops.length - 1] ?? 'unknown';
}

// True when this call is within the limit; false when the caller should get a 429.
export function allow(key: string, limit: number, windowMs: number, now: number = Date.now()): boolean {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
      if (buckets.size >= MAX_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

export function resetRateLimits() {
  buckets.clear();
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
