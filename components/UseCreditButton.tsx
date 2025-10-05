'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseCreditButtonProps {
  patternId: string;
  patternName: string;
  availableCredits: number;
  hasSubscription: boolean;
}

export default function UseCreditButton({
  patternId,
  patternName,
  availableCredits,
  hasSubscription,
}: UseCreditButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePurchaseWithCredit = async () => {
    if (!hasSubscription) {
      router.push('/account/subscription');
      return;
    }

    if (availableCredits < 1) {
      setError('You don\'t have enough credits. Credits renew with your subscription billing cycle.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/patterns/purchase-with-credit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patternId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to purchase pattern');
      }

      // Redirect to downloads page
      router.push('/account/downloads?success=true');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!hasSubscription) {
    return (
      <button
        onClick={handlePurchaseWithCredit}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Subscribe to Use Credits
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handlePurchaseWithCredit}
        disabled={loading || availableCredits < 1}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          'Processing...'
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Use 1 Credit ({availableCredits} available)
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {availableCredits < 1 && !error && (
        <p className="mt-2 text-sm text-yellow-600">
          No credits available. Credits renew with your subscription.
        </p>
      )}
    </div>
  );
}
