'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div id="newsletter" className="max-w-md mx-auto border border-green-200 bg-green-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-green-900 mb-2 text-center">
          ✓ You're Subscribed!
        </h2>
        <p className="text-green-700 text-center">
          Thanks for joining! Check your inbox for updates on new patterns.
        </p>
      </div>
    );
  }

  return (
    <div id="newsletter" className="max-w-md mx-auto border border-gray-200 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Get 4 New Patterns Weekly
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Join our newsletter for updates on new pattern releases
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition whitespace-nowrap disabled:bg-gray-400"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {error && (
        <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
