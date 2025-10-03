import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(
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

    const supabase = getSupabaseClient();

    // Fetch pattern
    const { data: pattern, error } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !pattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 });
    }

    return NextResponse.json({ pattern });
  } catch (error) {
    console.error('Fetch pattern error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
