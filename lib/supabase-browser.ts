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
 * Upload a file to Supabase Storage via server-side API (bypasses RLS)
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
    // Upload via server-side API to bypass RLS using service role key
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('path', path);

    const response = await fetch('/api/admin/storage/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Upload failed' };
    }

    return { url: data.url };
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
