'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function PatternUploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch('/api/admin/patterns/upload', {
        method: 'POST',
        body: formData,
      });

      // Handle non-JSON responses (like 413 errors)
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || 'Upload failed' };
      }

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('File too large. Preview images should be 1024×1024 PNG (max 2MB), full images 4096×4096 PNG (max 10MB)');
        }
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/patterns');
      }, 2000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
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

          {/* Preview Image (1024x1024) */}
          <div>
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">
              Preview Image (1024×1024 PNG)
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
              Upload the 1024×1024 preview version (free download)
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
              {uploading ? 'Uploading...' : 'Upload Pattern'}
            </button>
            <a
              href="/admin/patterns"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </a>
          </div>

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
          <strong>Instructions:</strong> Fill in all required fields, upload both the preview (1024×1024 PNG)
          and full resolution (4096×4096 PNG) images. The pattern will be automatically added to the database
          and a Stripe product will be created.
        </p>
      </div>
    </div>
  );
}
