import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client for browser uploads
// Uses anon key but admin pages are protected by NextAuth
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

/**
 * Upload a file to Supabase Storage using signed URLs (bypasses RLS and Vercel limits)
 * @param bucket - Storage bucket name
 * @param path - File path in bucket
 * @param file - File to upload
 * @returns Public URL of uploaded file or error
 */
export async function uploadFileToSupabase(
  bucket: string,
  path: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  try {
    // Step 1: Get signed upload URL from server (uses service role key)
    const urlResponse = await fetch('/api/admin/storage/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucket, path }),
    });

    // Handle non-JSON responses
    let urlData;
    const contentType = urlResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      urlData = await urlResponse.json();
    } else {
      const text = await urlResponse.text();
      console.error('Non-JSON response:', text);
      return { error: `Server error: ${text.substring(0, 200)}` };
    }

    if (!urlResponse.ok) {
      return { error: urlData.error || 'Failed to get upload URL' };
    }

    // Step 2: Upload file directly to Supabase using signed URL
    // This bypasses Vercel entirely - no file size limits!
    const uploadResponse = await fetch(urlData.signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-upsert': 'true', // Allow overwriting existing files
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      return { error: `Upload failed: ${errorText}` };
    }

    // Step 3: Return the public URL
    return { url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Upload exception:', error);
    return { error: error.message || 'Upload failed' };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - Storage bucket name
 * @param paths - File paths to delete
 */
export async function deleteFilesFromSupabase(
  bucket: string,
  paths: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseBrowser.storage.from(bucket).remove(paths);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete exception:', error);
    return { success: false, error: error.message || 'Delete failed' };
  }
}
