import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client for browser uploads
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file directly to Supabase Storage from the browser
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
    // Upload file
    const { error: uploadError } = await supabaseBrowser.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: uploadError.message };
    }

    // Get public URL
    const { data } = supabaseBrowser.storage.from(bucket).getPublicUrl(path);

    return { url: data.publicUrl };
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
