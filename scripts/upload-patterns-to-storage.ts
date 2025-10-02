import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PATTERNS_DIR = path.join(process.cwd(), 'Patterns 4096x4096');
const BUCKET_NAME = 'patterns';

async function uploadPatterns() {
  console.log('Starting pattern upload to Supabase Storage...\n');

  // Get all PNG files
  const files = fs.readdirSync(PATTERNS_DIR).filter(file =>
    file.toLowerCase().endsWith('.png')
  );

  if (files.length === 0) {
    console.log('No PNG files found in Patterns 4096x4096/');
    return;
  }

  console.log(`Found ${files.length} patterns to upload\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(PATTERNS_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);

    // Storage path (removing special characters for clean URLs)
    const storagePath = `premium/${file}`;

    try {
      // Check if file already exists
      const { data: existingFile } = await supabase.storage
        .from(BUCKET_NAME)
        .list('premium', {
          search: file,
        });

      if (existingFile && existingFile.length > 0) {
        console.log(`⊘ Skipped: ${file} (already exists)`);
        skipped++;
        continue;
      }

      // Upload file
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`✗ Failed: ${file} - ${error.message}`);
        failed++;
      } else {
        console.log(`✓ Uploaded: ${file}`);
        uploaded++;
      }
    } catch (error: any) {
      console.error(`✗ Error uploading ${file}:`, error.message);
      failed++;
    }
  }

  console.log(`\n✅ Upload complete!`);
  console.log(`   Uploaded: ${uploaded}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
}

uploadPatterns();
