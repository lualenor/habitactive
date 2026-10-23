type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  habitactiveRateLimit?: Map<string, RateLimitRecord>;
};

const store =
  globalForRateLimit.habitactiveRateLimit ??
  (globalForRateLimit.habitactiveRateLimit = new Map());

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Limitador en memoria para una sola instancia.
 *
 * Para despliegues con varias réplicas/serverless, sustituye esta capa por
 * Upstash Redis o el limitador del proveedor. La interfaz se mantiene igual.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    cleanExpired(now);
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const nextCount = existing.count + 1;
  existing.count = nextCount;

  return {
    allowed: nextCount <= limit,
    remaining: Math.max(0, limit - nextCount),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

function cleanExpired(now: number) {
  if (store.size < 1_000) return;
  for (const [key, value] of store) {
    if (value.resetAt <= now) store.delete(key);
  }
}
