import { NextRequest, NextResponse } from 'next/server';
import { expireOldCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';

/**
 * Cron job to expire credits older than 90 days
 *
 * This endpoint should be called daily by a cron service like:
 * - Vercel Cron Jobs (recommended for Vercel deployments)
 * - GitHub Actions
 * - External cron service (e.g., cron-job.org, EasyCron)
 *
 * Setup:
 * 1. Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-credits",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 *
 * 2. Set CRON_SECRET in environment variables
 * 3. Call this endpoint daily at midnight UTC
 *
 * Security:
 * - Requires CRON_SECRET header to prevent unauthorized access
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Running credit expiration cron job...');

    const result = await expireOldCredits();

    console.log(
      `Credit expiration completed: ${result.creditsExpired} credits expired across ${result.expiredCount} transactions`
    );

    return NextResponse.json({
      success: true,
      message: 'Credit expiration completed',
      expiredCount: result.expiredCount,
      creditsExpired: result.creditsExpired,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Credit expiration cron job failed:', error);
    return NextResponse.json(
      { error: error.message || 'Credit expiration failed' },
      { status: 500 }
    );
  }
}

// Also support POST for some cron services
export async function POST(req: NextRequest) {
  return GET(req);
}
