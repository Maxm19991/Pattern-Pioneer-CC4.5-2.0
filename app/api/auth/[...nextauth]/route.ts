import { handlers } from '@/auth';
import { NextRequest } from 'next/server';
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Wrap POST handler with rate limiting for login attempts
async function rateLimitedPOST(req: NextRequest) {
  // Apply rate limiting to signin requests
  const rateLimitResult = checkRateLimit(req, RateLimitPresets.auth);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // Call original NextAuth POST handler
  return handlers.POST(req);
}

export const GET = handlers.GET;
export const POST = rateLimitedPOST;
