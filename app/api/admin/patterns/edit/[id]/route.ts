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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fetch existing pattern
    const { data: existingPattern, error: fetchError } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingPattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 });
    }

    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const previewFile = formData.get('preview') as File | null;
    const fullFile = formData.get('full') as File | null;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = existingPattern.image_url;
    let slug = existingPattern.slug;

    // If name changed, update slug
    if (name !== existingPattern.name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Check if new slug already exists (but not for current pattern)
      const { data: existing } = await supabase
        .from('patterns')
        .select('id')
        .eq('slug', slug)
        .neq('id', params.id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'A pattern with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Upload new preview image if provided
    if (previewFile && previewFile.size > 0) {
      const previewFileName = `${slug}.png`;

      // Delete old preview if different filename (also remove old WEBP if exists)
      if (existingPattern.slug !== slug) {
        await supabase.storage
          .from('pattern-previews')
          .remove([`${existingPattern.slug}.png`, `${existingPattern.slug}.webp`]);
      }

      const previewBuffer = await previewFile.arrayBuffer();
      const { error: previewError } = await supabase.storage
        .from('pattern-previews')
        .upload(previewFileName, previewBuffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true,
        });

      if (previewError) {
        console.error('Preview upload error:', previewError);
        return NextResponse.json(
          { error: 'Failed to upload preview image' },
          { status: 500 }
        );
      }

      // Get new public URL
      const { data: previewUrlData } = supabase.storage
        .from('pattern-previews')
        .getPublicUrl(previewFileName);

      imageUrl = previewUrlData.publicUrl;
    }

    // Upload new full resolution image if provided
    if (fullFile && fullFile.size > 0) {
      const fullFileName = `${name}.png`;

      // Delete old full image if name changed
      if (name !== existingPattern.name) {
        await supabase.storage
          .from('patterns')
          .remove([`premium/${existingPattern.name}.png`]);
      }

      const fullBuffer = await fullFile.arrayBuffer();
      const { error: fullError } = await supabase.storage
        .from('patterns')
        .upload(`premium/${fullFileName}`, fullBuffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true,
        });

      if (fullError) {
        console.error('Full image upload error:', fullError);
        return NextResponse.json(
          { error: 'Failed to upload full resolution image' },
          { status: 500 }
        );
      }
    }

    // Update Stripe product if price changed or name changed
    if (
      existingPattern.stripe_product_id &&
      (parseFloat(price) !== parseFloat(existingPattern.price) ||
        name !== existingPattern.name)
    ) {
      try {
        // Update product name
        if (name !== existingPattern.name) {
          await stripe.products.update(existingPattern.stripe_product_id, {
            name: name,
            description: description || undefined,
          });
        }

        // Create new price if price changed
        if (parseFloat(price) !== parseFloat(existingPattern.price)) {
          const newPrice = await stripe.prices.create({
            product: existingPattern.stripe_product_id,
            currency: 'eur',
            unit_amount: Math.round(parseFloat(price) * 100),
          });

          // Update product default price
          await stripe.products.update(existingPattern.stripe_product_id, {
            default_price: newPrice.id,
          });

          // Archive old price
          if (existingPattern.stripe_price_id) {
            await stripe.prices.update(existingPattern.stripe_price_id, {
              active: false,
            });
          }

          // Update pattern with new price ID
          await supabase
            .from('patterns')
            .update({ stripe_price_id: newPrice.id })
            .eq('id', params.id);
        }
      } catch (stripeError) {
        console.error('Stripe update error:', stripeError);
        // Continue anyway - database update is more important
      }
    }

    // Update pattern in database
    const { data: pattern, error: dbError } = await supabase
      .from('patterns')
      .update({
        name,
        slug,
        description: description || null,
        category: category || null,
        price: parseFloat(price),
        image_url: imageUrl,
        free_image_url: imageUrl,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to update pattern' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pattern,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
