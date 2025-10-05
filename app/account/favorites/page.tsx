import Navigation from "@/components/Navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const supabase = getSupabaseAdmin();

  // Try to fetch user's favorites
  let favorites = null;
  let hasError = false;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        patterns (
          id,
          name,
          slug,
          image_url,
          price,
          description
        )
      `)
      .eq('email', session.user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Favorites fetch error:', error);
      hasError = true;
    } else {
      favorites = data;
    }
  } catch (error) {
    console.error('Favorites error:', error);
    hasError = true;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600 mb-8">
          Patterns you've saved for later
        </p>

        {hasError ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Favorites Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              The favorites feature is being set up. Check back soon to save your favorite patterns!
            </p>

            <Link
              href="/patterns"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Browse Patterns
            </Link>
          </div>
        ) : !favorites || favorites.length === 0 ? (
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
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding patterns to your favorites to see them here
            </p>

            <Link
              href="/patterns"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Browse Patterns
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite: any) => (
              <Link
                key={favorite.id}
                href={`/patterns/${favorite.patterns.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={favorite.patterns.image_url}
                    alt={favorite.patterns.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {favorite.patterns.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {favorite.patterns.description}
                  </p>
                  <p className="font-bold text-gray-900">
                    €{favorite.patterns.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(favorite.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
