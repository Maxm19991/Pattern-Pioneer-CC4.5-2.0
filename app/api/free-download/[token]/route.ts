import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json({ error: 'Invalid download link' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Find the download record with this token
    const { data: download, error: downloadError } = await supabase
      .from('downloads')
      .select('id, email, pattern_id, is_free, download_token, patterns(name, slug, free_image_url)')
      .eq('download_token', token)
      .eq('is_free', true)
      .single();

    if (downloadError || !download) {
      return NextResponse.json(
        { error: 'Download link not found or expired' },
        { status: 404 }
      );
    }

    // Get the pattern data
    const pattern = download.patterns as any;

    if (!pattern || !pattern.free_image_url) {
      return NextResponse.json(
        { error: 'Pattern file not found' },
        { status: 404 }
      );
    }

    // Extract the file path from the public URL
    // The free_image_url is like: https://nainnrcikdpjtzuhdhlj.supabase.co/storage/v1/object/public/pattern-previews/pattern-slug.png
    const urlParts = pattern.free_image_url.split('/pattern-previews/');
    const fileName = urlParts[1];

    if (!fileName) {
      return NextResponse.json(
        { error: 'Invalid pattern file URL' },
        { status: 500 }
      );
    }

    // Download the file from Supabase storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('pattern-previews')
      .download(fileName);

    if (fileError || !fileData) {
      console.error('File download error:', fileError);
      return NextResponse.json(
        { error: 'Failed to download pattern file' },
        { status: 500 }
      );
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Return the file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${pattern.slug}.png"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
