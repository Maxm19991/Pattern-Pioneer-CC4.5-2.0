import Navigation from "@/components/Navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }
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
        </div>
      </main>
    </div>
  );
}
