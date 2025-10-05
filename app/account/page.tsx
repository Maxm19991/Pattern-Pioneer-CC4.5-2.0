import Navigation from "@/components/Navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { getAvailableCredits } from "@/lib/credits";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Get subscription status
  const supabase = getSupabaseClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', session.user.id)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Get available credits
  const availableCredits = session.user.id ? await getAvailableCredits(session.user.id) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Signed in as <span className="font-semibold">{session.user.email}</span>
          </p>
        </div>

        {/* Subscription Status Banner */}
        {subscription ? (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {subscription.plan_type === 'monthly' ? 'Monthly' : 'Yearly'} Subscriber
                </h2>
                <p className="opacity-90">
                  {subscription.status === 'trialing' ? 'Free Trial Active' : 'Active Subscription'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold">{availableCredits}</div>
                <div className="text-sm opacity-90">Credits Available</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Start Your Subscription</h2>
                <p className="opacity-90">Get 12 credits per month • All patterns 1 credit</p>
              </div>
              <Link
                href="/account/subscription"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/account/downloads"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Downloads</h2>
            </div>
            <p className="text-gray-600">Access your purchased patterns</p>
          </Link>

          <Link
            href="/account/orders"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Orders</h2>
            </div>
            <p className="text-gray-600">View your purchase history</p>
          </Link>

          <Link
            href="/account/favorites"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Favorites</h2>
            </div>
            <p className="text-gray-600">Your saved patterns</p>
          </Link>

          <Link
            href="/account/subscription"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
            </div>
            <p className="text-gray-600">
              {subscription ? 'Manage your subscription' : 'Start your subscription'}
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
