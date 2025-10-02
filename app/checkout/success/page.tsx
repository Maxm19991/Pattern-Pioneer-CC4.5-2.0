'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useCart } from '@/lib/store/cart';

export default function SuccessPage() {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    // Clear cart on successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your patterns are ready to download.
          </p>

          <div className="space-y-4">
            <Link
              href="/account/downloads"
              className="block w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              View My Downloads
            </Link>
            <Link
              href="/patterns"
              className="block w-full text-gray-600 hover:text-gray-900"
            >
              Browse More Patterns
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
