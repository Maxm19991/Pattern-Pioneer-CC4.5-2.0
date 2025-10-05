'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFileToSupabase } from '@/lib/supabase-browser';

export const dynamic = 'force-dynamic';

export default function PatternUploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setUploadProgress('Preparing upload...');

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const price = formData.get('price') as string;
      const previewFile = formData.get('preview') as File;
      const fullFile = formData.get('full') as File;

      if (!name || !price || !previewFile || !fullFile) {
        throw new Error('Please fill in all required fields');
      }

      // Generate slug
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Upload low resolution image to public bucket
      setUploadProgress('Uploading low resolution image...');
      const previewFileName = `${slug}.png`;
      const previewResult = await uploadFileToSupabase(
        'pattern-previews',
        previewFileName,
        previewFile
      );

      if (previewResult.error) {
        throw new Error(`Failed to upload low resolution image: ${previewResult.error}`);
      }

      // Upload full resolution image to private bucket
      setUploadProgress('Uploading full resolution image...');
      const fullFileName = `${name}.png`;
      const fullResult = await uploadFileToSupabase(
        'patterns',
        `premium/${fullFileName}`,
        fullFile
      );

      if (fullResult.error) {
        throw new Error(`Failed to upload full resolution image: ${fullResult.error}`);
      }

      // Send metadata to API
      setUploadProgress('Creating pattern record...');
      const response = await fetch('/api/admin/patterns/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          category,
          description,
          price: parseFloat(price),
          imageUrl: previewResult.url,
          previewFileName,
          fullFileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      setUploadProgress('Success!');
      setTimeout(() => {
        router.push('/admin/patterns');
      }, 2000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Pattern</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pattern Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
              placeholder="e.g., Wheat Fields"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            >
              <option value="">Select category</option>
              <option value="Nature">Nature</option>
              <option value="Abstract">Abstract</option>
              <option value="Geometric">Geometric</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
              placeholder="Pattern description..."
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (€)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              required
              defaultValue="6.99"
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
          </div>

          {/* Low Resolution Image (1024x1024) */}
          <div>
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">
              Low Resolution Image (1024×1024 PNG)
            </label>
            <input
              type="file"
              id="preview"
              name="preview"
              accept="image/png"
              required
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload the 1024×1024 low resolution version (free download)
            </p>
          </div>

          {/* Full Image (4096x4096) */}
          <div>
            <label htmlFor="full" className="block text-sm font-medium text-gray-700 mb-2">
              Full Resolution Image (4096×4096 PNG)
            </label>
            <input
              type="file"
              id="full"
              name="full"
              accept="image/png"
              required
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload the 4096×4096 full resolution version
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadProgress || (uploading ? 'Uploading...' : 'Upload Pattern')}
            </button>
            <a
              href="/admin/patterns"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </a>
          </div>

          {/* Upload Progress */}
          {uploading && uploadProgress && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">{uploadProgress}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                Pattern uploaded successfully! Redirecting...
              </p>
            </div>
          )}
        </form>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Instructions:</strong> Fill in all required fields, upload both the low resolution (1024×1024 PNG)
          and full resolution (4096×4096 PNG) images. The pattern will be automatically added to the database
          and a Stripe product will be created.
        </p>
      </div>
    </div>
  );
}
