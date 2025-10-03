import { auth } from '@/auth';
import { getSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const supabase = getSupabaseClient();
  const { data: user } = await supabase
    .from('users')
    .select('is_admin')
    .eq('email', session.user.email)
    .single();

  if (!user?.is_admin) {
    redirect('/');
  }

  return session;
}

export async function isAdmin(email: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data: user } = await supabase
    .from('users')
    .select('is_admin')
    .eq('email', email)
    .single();

  return user?.is_admin || false;
}
