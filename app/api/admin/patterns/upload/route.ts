import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Increase body size limit for image uploads (50MB for full resolution)
export const runtime = 'nodejs';

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

    // Parse JSON body (files uploaded client-side to Supabase)
    const body = await req.json();
    const { name, slug, category, description, price, imageUrl, previewFileName, fullFileName } = body;

    // Validate required fields
    if (!name || !slug || !price || !imageUrl || !previewFileName || !fullFileName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name: name,
      description: description || undefined,
      default_price_data: {
        currency: 'eur',
        unit_amount: Math.round(price * 100),
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
          price: price,
          image_url: imageUrl,
          free_image_url: imageUrl,
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
