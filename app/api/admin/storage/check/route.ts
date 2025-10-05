import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIsAdmin = await isAdmin(session.user.email);
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { bucket, path } = body;

    if (!bucket || !path) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Try to get file metadata to check if it exists
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.includes('/') ? path.split('/').slice(0, -1).join('/') : '', {
        search: path.includes('/') ? path.split('/').pop() : path,
      });

    // File exists if we found it in the list
    const exists = data && data.length > 0;

    return NextResponse.json({ exists });
  } catch (error: any) {
    console.error('Storage check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check file' },
      { status: 500 }
    );
  }
}
