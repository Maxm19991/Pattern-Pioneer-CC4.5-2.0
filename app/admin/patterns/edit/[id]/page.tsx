'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatternEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pattern, setPattern] = useState<any>(null);

  useEffect(() => {
    // Fetch pattern data
    fetch(`/api/admin/patterns/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPattern(data.pattern);
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

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch(`/api/admin/patterns/edit/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/patterns');
      }, 2000);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Update failed');
      setSaving(false);
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

          {/* Preview Image (Optional) */}
          <div>
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">
              Preview Image (1024×1024 WEBP) - Optional
            </label>
            <input
              type="file"
              id="preview"
              name="preview"
              accept="image/webp"
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep existing preview image
            </p>
          </div>

          {/* Full Image (Optional) */}
          <div>
            <label htmlFor="full" className="block text-sm font-medium text-gray-700 mb-2">
              Full Resolution Image (4096×4096 PNG) - Optional
            </label>
            <input
              type="file"
              id="full"
              name="full"
              accept="image/png"
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
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
              {saving ? 'Saving...' : 'Save Changes'}
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
                Pattern updated successfully! Redirecting...
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
