import Navigation from "@/components/Navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const supabase = getSupabaseAdmin();

  // Fetch user's orders with order items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        pattern_name,
        price
      )
    `)
    .eq('email', session.user.email)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Purchase History</h1>
        <p className="text-gray-600 mb-8">
          View all your past orders and purchases
        </p>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your purchase history here
            </p>

            <Link
              href="/patterns"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Browse Patterns
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order placed</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold text-gray-900">
                        €{order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono text-sm text-gray-900">
                        {order.id.slice(0, 8)}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
                  <div className="space-y-3">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.pattern_name}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          €{item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                    <Link
                      href="/account/downloads"
                      className="flex-1 text-center bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                      View Downloads
                    </Link>
                    <Link
                      href={`/checkout/success?session_id=${order.stripe_checkout_session_id}`}
                      className="flex-1 text-center bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
