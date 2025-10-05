'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Subscription, CreditTransaction } from '@/lib/types';

interface SubscriptionStatus {
  subscription: Subscription | null;
  availableCredits: number;
  transactions: CreditTransaction[];
  expiringCredits: { amount: number; expiresAt: string }[];
}

function SubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions/status');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error('Failed to load subscription status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message);
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/subscriptions/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      // Redirect to Stripe billing portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message);
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeColor = (subscriptionStatus: string) => {
    switch (subscriptionStatus) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Subscription</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subscription</h1>

        {/* Success/Cancel Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
            Successfully subscribed! Your credits will be added shortly.
          </div>
        )}
        {canceled && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            Subscription canceled. You can try again anytime.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Active Subscription */}
        {status?.subscription ? (
          <div className="space-y-6">
            {/* Subscription Details Card */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Current Plan</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    status.subscription.status
                  )}`}
                >
                  {status.subscription.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Plan Type</p>
                  <p className="font-medium capitalize">
                    {status.subscription.plan_type} Plan
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">
                    {status.subscription.plan_type === 'monthly'
                      ? '€9.99/month'
                      : '€59.94/year'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits per Billing Cycle</p>
                  <p className="font-medium">12 credits</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Billing Date</p>
                  <p className="font-medium">
                    {formatDate(status.subscription.current_period_end)}
                  </p>
                </div>
              </div>

              {status.subscription.cancel_at_period_end && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                  Your subscription will be canceled on{' '}
                  {formatDate(status.subscription.current_period_end)}
                </div>
              )}

              <button
                onClick={handleManageSubscription}
                disabled={actionLoading}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>

            {/* Credits Card */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Credits</h2>
              <div className="mb-4">
                <p className="text-4xl font-bold text-blue-600">
                  {status.availableCredits}
                </p>
                <p className="text-sm text-gray-600">Available Credits</p>
              </div>

              {status.expiringCredits.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded text-sm">
                  ⚠️ {status.expiringCredits.reduce((sum, c) => sum + c.amount, 0)}{' '}
                  credit(s) expiring within 7 days (Credits expire after 90 days)
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {status.transactions.length > 0 ? (
                <div className="space-y-3">
                  {status.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">
                          {transaction.description || transaction.transaction_type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                      <span
                        className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No transactions yet</p>
              )}
            </div>
          </div>
        ) : (
          /* No Subscription - Show Pricing */
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-gray-600">
                Get 12 credits per billing cycle. Each pattern costs 1 credit.
                <br />
                <span className="text-sm">Credits expire after 90 days.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Monthly Plan */}
              <div className="border-2 rounded-lg p-6 hover:border-blue-500 transition">
                <h3 className="text-xl font-bold mb-2">Monthly Plan</h3>
                <p className="text-3xl font-bold mb-4">
                  €9.99<span className="text-lg font-normal text-gray-600">/month</span>
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    12 credits per month
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    7-day free trial
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Cancel anytime
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Credits expire after 90 days
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={actionLoading}
                  className="w-full bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Loading...' : 'Start Free Trial'}
                </button>
              </div>

              {/* Yearly Plan */}
              <div className="border-2 border-blue-500 rounded-lg p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Save 50%
                </div>
                <h3 className="text-xl font-bold mb-2">Yearly Plan</h3>
                <p className="text-3xl font-bold mb-1">
                  €59.94<span className="text-lg font-normal text-gray-600">/year</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  (€4.99/month - Save €59.94/year)
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    12 credits per month (144/year)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    7-day free trial
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    50% discount vs monthly
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Credits expire after 90 days
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Loading...' : 'Start Free Trial'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Subscription</h1>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SubscriptionPageContent />
    </Suspense>
  );
}
