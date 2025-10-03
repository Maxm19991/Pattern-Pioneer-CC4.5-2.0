import { getSupabaseClient } from '../supabase';
import type { Pattern } from '../types';

export async function getPatterns(): Promise<Pattern[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching patterns:', error);
    return [];
  }

  return data as Pattern[];
}

export async function getPatternBySlug(slug: string): Promise<Pattern | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching pattern:', error);
    return null;
  }

  return data as Pattern;
}

export async function getPatternById(id: string): Promise<Pattern | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching pattern:', error);
    return null;
  }

  return data as Pattern;
}
