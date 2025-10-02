import { requireAdmin } from '@/lib/admin';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold">
                Admin Panel
              </Link>
              <nav className="flex space-x-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/patterns"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  Patterns
                </Link>
                <Link
                  href="/admin/orders"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  Orders
                </Link>
                <Link
                  href="/admin/users"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  Users
                </Link>
              </nav>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-800 hover:bg-gray-700 transition"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
