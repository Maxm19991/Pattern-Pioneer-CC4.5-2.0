'use client';

import Navigation from "@/components/Navigation";
import { useCart } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, getTotal } = useCart();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some beautiful patterns to get started</p>
            <Link
              href="/patterns"
              className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              Browse Patterns
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.pattern.id}
                className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.pattern.image_url}
                    alt={item.pattern.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.pattern.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">4096×4096 PNG</p>
                  <p className="text-primary-600 font-bold">
                    €{item.pattern.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.pattern.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-primary-600 transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/patterns"
                className="block w-full text-center text-gray-600 mt-4 hover:text-gray-900"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
