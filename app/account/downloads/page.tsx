import Navigation from "@/components/Navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";
import Image from "next/image";
import Link from "next/link";

export default async function DownloadsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Fetch user's downloads
  const { data: downloads } = await supabase
    .from('downloads')
    .select(`
      *,
      patterns (
        id,
        name,
        slug,
        image_url,
        price
      ),
      orders (
        created_at
      )
    `)
    .eq('email', session.user.email)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Downloads</h1>
        <p className="text-gray-600 mb-8">
          Access your purchased patterns (4096×4096 PNG)
        </p>

        {!downloads || downloads.length === 0 ? (
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
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Downloads Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Purchase some patterns to see them here
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
            {downloads.map((download: any) => (
              <div
                key={download.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={download.patterns.image_url}
                    alt={download.patterns.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {download.patterns.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {download.is_free ? 'Free Download' : 'Premium'} • 4096×4096 PNG
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>
                      Downloaded {download.download_count || 0} time
                      {download.download_count === 1 ? '' : 's'}
                    </span>
                    {download.last_downloaded_at && (
                      <span>
                        Last: {new Date(download.last_downloaded_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <DownloadButton patternId={download.pattern_id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
