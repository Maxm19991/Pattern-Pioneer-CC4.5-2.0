import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover' as any,
});

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

    const supabase = getSupabaseAdmin();

    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const previewFile = formData.get('preview') as File;
    const fullFile = formData.get('full') as File;

    // Validate required fields
    if (!name || !price || !previewFile || !fullFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('patterns')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A pattern with this name already exists' },
        { status: 400 }
      );
    }

    // Upload preview image (1024x1024 PNG) to public bucket
    const previewFileName = `${slug}.png`;
    const previewBuffer = await previewFile.arrayBuffer();
    const { error: previewError } = await supabase.storage
      .from('pattern-previews')
      .upload(previewFileName, previewBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (previewError) {
      console.error('Preview upload error:', previewError);
      return NextResponse.json(
        { error: 'Failed to upload preview image' },
        { status: 500 }
      );
    }

    // Get public URL for preview
    const { data: previewUrlData } = supabase.storage
      .from('pattern-previews')
      .getPublicUrl(previewFileName);

    // Upload full resolution image (4096x4096 PNG) to private bucket
    const fullFileName = `${name}.png`;
    const fullBuffer = await fullFile.arrayBuffer();
    const { error: fullError } = await supabase.storage
      .from('patterns')
      .upload(`premium/${fullFileName}`, fullBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (fullError) {
      console.error('Full image upload error:', fullError);
      // Clean up preview image
      await supabase.storage.from('pattern-previews').remove([previewFileName]);
      return NextResponse.json(
        { error: 'Failed to upload full resolution image' },
        { status: 500 }
      );
    }

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name: name,
      description: description || undefined,
      default_price_data: {
        currency: 'eur',
        unit_amount: Math.round(parseFloat(price) * 100),
      },
      metadata: {
        slug: slug,
        category: category || '',
      },
    });

    // Create pattern record in database
    const { data: pattern, error: dbError } = await supabase
      .from('patterns')
      .insert([
        {
          name,
          slug,
          description: description || null,
          category: category || null,
          price: parseFloat(price),
          image_url: previewUrlData.publicUrl,
          free_image_url: previewUrlData.publicUrl,
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripeProduct.default_price as string,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Clean up uploaded files and Stripe product
      await supabase.storage.from('pattern-previews').remove([previewFileName]);
      await supabase.storage
        .from('patterns')
        .remove([`premium/${fullFileName}`]);
      await stripe.products.update(stripeProduct.id, { active: false });
      return NextResponse.json(
        { error: 'Failed to create pattern record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pattern,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
