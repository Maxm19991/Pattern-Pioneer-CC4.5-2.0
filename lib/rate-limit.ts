import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter
 * Note: This resets on server restart and won't work across multiple instances
 * For production scaling, consider using Upstash or Redis
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of Array.from(rateLimitStore.entries())) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Optional: Use a custom identifier instead of IP
   */
  identifier?: string;
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP (works with proxies, load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to a generic identifier if IP can't be determined
  return 'unknown';
}

/**
 * Check if request is rate limited
 * Returns null if allowed, or NextResponse with 429 status if rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  const identifier = config.identifier || getClientIP(request);
  const key = `${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired, create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null; // Allow request
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        }
      }
    );
  }

  // Increment count and allow request
  entry.count++;
  rateLimitStore.set(key, entry);
  return null; // Allow request
}

/**
 * Preset configurations for common use cases
 */
export const RateLimitPresets = {
  // Auth endpoints: 5 attempts per 15 minutes
  auth: {
    maxRequests: 5,
    windowSeconds: 15 * 60,
  },
  // Free downloads: 3 per hour per IP
  freeDownload: {
    maxRequests: 3,
    windowSeconds: 60 * 60,
  },
  // Newsletter: 5 per hour per IP
  newsletter: {
    maxRequests: 5,
    windowSeconds: 60 * 60,
  },
  // Checkout: 10 per hour per user
  checkout: {
    maxRequests: 10,
    windowSeconds: 60 * 60,
  },
  // General API: 100 per 15 minutes
  general: {
    maxRequests: 100,
    windowSeconds: 15 * 60,
  },
};
