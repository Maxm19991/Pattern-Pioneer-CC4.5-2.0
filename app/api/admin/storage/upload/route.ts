import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Get a signed upload URL (doesn't upload the file, just returns URL)
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

    // Create a signed upload URL (valid for 5 minutes)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      console.error('Signed URL error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get public URL for after upload completes
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Storage upload URL error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}
