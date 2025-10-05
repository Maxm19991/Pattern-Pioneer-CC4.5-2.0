'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFileToSupabase } from '@/lib/supabase-browser';

export const dynamic = 'force-dynamic';

export default function PatternEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pattern, setPattern] = useState<any>(null);
  const [hasLowResImage, setHasLowResImage] = useState(false);
  const [hasFullResImage, setHasFullResImage] = useState(false);

  useEffect(() => {
    // Fetch pattern data
    fetch(`/api/admin/patterns/${params.id}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPattern(data.pattern);

          // Check if low res image exists
          if (data.pattern.free_image_url) {
            try {
              const response = await fetch(data.pattern.free_image_url, { method: 'HEAD' });
              setHasLowResImage(response.ok);
            } catch {
              setHasLowResImage(false);
            }
          }

          // Check if full res image exists in storage
          // The full res image is stored as: patterns/premium/{name}.png
          if (data.pattern.name) {
            try {
              const checkResponse = await fetch('/api/admin/storage/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bucket: 'patterns',
                  path: `premium/${data.pattern.name}.png`
                }),
              });
              const checkData = await checkResponse.json();
              setHasFullResImage(checkData.exists);
            } catch {
              setHasFullResImage(false);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load pattern');
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setUploadProgress('Preparing update...');

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const price = formData.get('price') as string;
      const previewFile = formData.get('preview') as File | null;
      const fullFile = formData.get('full') as File | null;

      let newImageUrl: string | undefined;
      let newPreviewFileName: string | undefined;
      let newFullFileName: string | undefined;

      // Upload new low resolution image if provided
      if (previewFile && previewFile.size > 0) {
        setUploadProgress('Uploading low resolution image...');
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const previewFileName = `${slug}.png`;

        const previewResult = await uploadFileToSupabase(
          'pattern-previews',
          previewFileName,
          previewFile
        );

        if (previewResult.error) {
          throw new Error(`Failed to upload low resolution image: ${previewResult.error}`);
        }

        newImageUrl = previewResult.url;
        newPreviewFileName = previewFileName;
      }

      // Upload new full resolution image if provided
      if (fullFile && fullFile.size > 0) {
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

        newFullFileName = fullFileName;
      }

      // Send metadata to API
      setUploadProgress('Updating pattern record...');
      const response = await fetch(`/api/admin/patterns/edit/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          category,
          description,
          price: parseFloat(price),
          newImageUrl,
          newPreviewFileName,
          newFullFileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      setSuccess(true);
      setUploadProgress('Success!');
      setTimeout(() => {
        router.push('/admin/patterns');
      }, 2000);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Update failed');
      setSaving(false);
      setUploadProgress('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pattern...</p>
        </div>
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Pattern not found'}</p>
        <a href="/admin/patterns" className="text-gray-900 hover:underline mt-4 inline-block">
          Back to Patterns
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Pattern</h1>

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
              disabled={saving}
              defaultValue={pattern.name}
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
              disabled={saving}
              defaultValue={pattern.category || ''}
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
              disabled={saving}
              defaultValue={pattern.description || ''}
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
              disabled={saving}
              defaultValue={pattern.price}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
          </div>

          {/* Low Resolution Image (Optional) */}
          <div>
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">
              Low Resolution Image (1024×1024 PNG) - Optional
            </label>
            {hasLowResImage && (
              <p className="text-xs text-green-600 mb-1">
                ✓ Low resolution image currently uploaded
              </p>
            )}
            <input
              type="file"
              id="preview"
              name="preview"
              accept="image/png"
              disabled={saving}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 ${
                hasLowResImage ? 'bg-green-500 bg-opacity-30' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep existing low resolution image (free download)
            </p>
          </div>

          {/* Full Image (Optional) */}
          <div>
            <label htmlFor="full" className="block text-sm font-medium text-gray-700 mb-2">
              Full Resolution Image (4096×4096 PNG) - Optional
            </label>
            {hasFullResImage && (
              <p className="text-xs text-green-600 mb-1">
                ✓ Full resolution image currently uploaded
              </p>
            )}
            <input
              type="file"
              id="full"
              name="full"
              accept="image/png"
              disabled={saving}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 ${
                hasFullResImage ? 'bg-green-500 bg-opacity-30' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep existing full resolution image
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadProgress || (saving ? 'Saving...' : 'Save Changes')}
            </button>
            <a
              href="/admin/patterns"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </a>
          </div>

          {/* Upload Progress */}
          {saving && uploadProgress && (
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
                Pattern updated successfully! Redirecting...
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
