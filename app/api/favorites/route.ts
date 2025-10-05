import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { patternId } = body;

    if (!patternId) {
      return NextResponse.json(
        { error: 'Pattern ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const email = session.user.email;

    // Check if favorite already exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('email', email)
      .eq('pattern_id', patternId)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
          { error: 'Failed to remove favorite' },
          { status: 500 }
        );
      }

      return NextResponse.json({ isFavorited: false });
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert([
          {
            email,
            pattern_id: patternId,
          },
        ]);

      if (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json(
          { error: 'Failed to add favorite' },
          { status: 500 }
        );
      }

      return NextResponse.json({ isFavorited: true });
    }
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
