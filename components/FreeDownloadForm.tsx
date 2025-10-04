'use client';

import { useState } from 'react';

interface FreeDownloadFormProps {
  patternId: string;
  patternName: string;
}

export default function FreeDownloadForm({ patternId, patternName }: FreeDownloadFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/patterns/free-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          patternId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to download pattern');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Free download error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-1">✓ Success!</p>
          <p className="text-sm">
            Check your email for the download link! You've also been subscribed to our newsletter for updates on new patterns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h3 className="font-semibold text-gray-900 mb-2">
        Get Free Version (1024×1024)
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Sign up for our newsletter to get the free version of this pattern!
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg mb-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Download'}
        </button>
      </form>
    </div>
  );
}
