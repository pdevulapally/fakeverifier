/**
 * Rate Limiter Implementation
 * Provides rate limiting for API endpoints with IP-based tracking
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  burstCount: number;
  burstResetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now && entry.burstResetTime < now) {
        this.store.delete(key);
      }
    }
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  checkLimit(
    identifier: string,
    limit: number = 60,
    windowMs: number = 60 * 60 * 1000, // 1 hour
    burstLimit: number = 10,
    burstWindowMs: number = 60 * 1000 // 1 minute
  ): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
    const key = this.getKey(identifier);
    const now = Date.now();
    
    let entry = this.store.get(key);
    
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
        burstCount: 0,
        burstResetTime: now + burstWindowMs,
      };
      this.store.set(key, entry);
    }

    // Reset counters if windows have expired
    if (now >= entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + windowMs;
    }
    
    if (now >= entry.burstResetTime) {
      entry.burstCount = 0;
      entry.burstResetTime = now + burstWindowMs;
    }

    // Check burst limit first (more restrictive)
    if (entry.burstCount >= burstLimit) {
      return {
        allowed: false,
        remaining: Math.max(0, burstLimit - entry.burstCount),
        resetTime: entry.burstResetTime,
        retryAfter: Math.ceil((entry.burstResetTime - now) / 1000),
      };
    }

    // Check hourly limit
    if (entry.count >= limit) {
      return {
        allowed: false,
        remaining: Math.max(0, limit - entry.count),
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      };
    }

    // Increment counters
    entry.count++;
    entry.burstCount++;

    return {
      allowed: true,
      remaining: Math.max(0, limit - entry.count),
      resetTime: entry.resetTime,
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Rate limiting middleware for API routes
export function rateLimit(
  limit: number = 60,
  windowMs: number = 60 * 60 * 1000,
  burstLimit: number = 10,
  burstWindowMs: number = 60 * 1000
) {
  return (request: Request): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } => {
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';

    return rateLimiter.checkLimit(clientIp, limit, windowMs, burstLimit, burstWindowMs);
  };
}

// Cleanup function for graceful shutdown
export function cleanupRateLimiter() {
  rateLimiter.destroy();
}
