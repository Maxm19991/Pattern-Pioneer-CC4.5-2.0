import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function DELETE(
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

    // Fetch pattern to get file names and Stripe IDs
    const { data: pattern, error: fetchError } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !pattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 });
    }

    // Check if pattern has been purchased
    const { count: orderCount } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true })
      .eq('pattern_id', params.id);

    if (orderCount && orderCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete pattern that has been purchased. Consider archiving instead.',
        },
        { status: 400 }
      );
    }

    // Delete from Stripe
    if (pattern.stripe_product_id) {
      try {
        await stripe.products.update(pattern.stripe_product_id, {
          active: false,
        });
      } catch (stripeError) {
        console.error('Stripe deletion error:', stripeError);
        // Continue anyway - database deletion is more important
      }
    }

    // Delete files from storage
    try {
      // Delete preview image
      await supabase.storage
        .from('pattern-previews')
        .remove([`${pattern.slug}.webp`]);

      // Delete full resolution image
      await supabase.storage
        .from('patterns')
        .remove([`premium/${pattern.name}.png`]);
    } catch (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue anyway - database deletion is most important
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('patterns')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete pattern' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pattern deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
