import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/auth';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { patternId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabase();
    const patternId = params.patternId;

    // Check if user has access to this pattern
    const { data: download, error: downloadError } = await supabase
      .from('downloads')
      .select('*, patterns(name)')
      .eq('pattern_id', patternId)
      .eq('email', session.user.email)
      .single();

    if (downloadError || !download) {
      return NextResponse.json(
        { error: 'You do not have access to this pattern' },
        { status: 403 }
      );
    }

    // Get pattern name for filename
    const patternName = (download as any).patterns?.name || 'pattern';
    const fileName = `${patternName}.png`;

    // Generate signed URL (valid for 60 seconds)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('patterns')
      .createSignedUrl(`premium/${fileName}`, 60);

    if (urlError || !signedUrlData) {
      console.error('Error generating signed URL:', urlError);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    // Update download count
    await supabase
      .from('downloads')
      .update({
        download_count: (download.download_count || 0) + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', download.id);

    // Return signed URL
    return NextResponse.json({
      url: signedUrlData.signedUrl,
      fileName,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
