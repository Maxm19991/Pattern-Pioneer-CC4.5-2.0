import { createClient } from '@supabase/supabase-js';
import patternsData from '../lib/data/patterns.json';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migratePatterns() {
  console.log(`Starting migration of ${patternsData.length} patterns to Supabase...`);

  // Check if patterns already exist
  const { data: existingPatterns, error: checkError } = await supabase
    .from('patterns')
    .select('slug');

  if (checkError) {
    console.error('Error checking existing patterns:', checkError);
    return;
  }

  if (existingPatterns && existingPatterns.length > 0) {
    console.log(`Found ${existingPatterns.length} existing patterns. Clearing table first...`);
    const { error: deleteError } = await supabase
      .from('patterns')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing patterns:', deleteError);
      return;
    }
  }

  // Insert patterns in batches of 50
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < patternsData.length; i += batchSize) {
    const batch = patternsData.slice(i, i + batchSize).map(pattern => ({
      // Remove the old ID, let Supabase generate UUIDs
      name: pattern.name,
      slug: pattern.slug,
      description: pattern.description,
      image_url: pattern.image_url,
      price: pattern.price,
      is_active: pattern.is_active,
    }));

    const { data, error } = await supabase
      .from('patterns')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      continue;
    }

    inserted += data?.length || 0;
    console.log(`✓ Inserted batch ${i / batchSize + 1}: ${data?.length} patterns (${inserted}/${patternsData.length})`);
  }

  console.log(`\n✅ Migration complete! ${inserted} patterns inserted into Supabase.`);
}

migratePatterns();
