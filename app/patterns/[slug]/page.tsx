import { getPatternBySlug, getPatterns } from "@/lib/data/patterns";
import Navigation from "@/components/Navigation";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FreeDownloadForm from "@/components/FreeDownloadForm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getSupabaseClient } from "@/lib/supabase";
import Link from "next/link";

interface PatternPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const patterns = await getPatterns();
  return patterns.map((pattern) => ({
    slug: pattern.slug,
  }));
}

export default async function PatternPage({ params }: PatternPageProps) {
  const pattern = await getPatternBySlug(params.slug);

  if (!pattern) {
    notFound();
  }

  // Check if user owns this pattern and if it's favorited
  const session = await auth();
  let userOwnsPattern = false;
  let isFavorited = false;

  if (session?.user?.email) {
    const supabase = getSupabaseClient();

    // Check ownership
    const { data: download } = await supabase
      .from('downloads')
      .select('id')
      .eq('email', session.user.email)
      .eq('pattern_id', pattern.id)
      .single();

    userOwnsPattern = !!download;

    // Check if favorited
    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('email', session.user.email)
      .eq('pattern_id', pattern.id)
      .single();

    isFavorited = !!favorite;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Pattern Preview */}
          <div>
            <div className="sticky top-24">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={pattern.image_url}
                    alt={pattern.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pattern Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {pattern.name}
              </h1>
              <FavoriteButton patternId={pattern.id} initialIsFavorited={isFavorited} />
            </div>
            <p className="text-gray-600 mb-6">{pattern.description}</p>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  €{pattern.price.toFixed(2)}
                </span>
                <span className="text-gray-500">4096×4096 PNG</span>
              </div>

              {userOwnsPattern ? (
                <Link
                  href="/account/downloads"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Already Purchased - View Downloads
                </Link>
              ) : (
                <AddToCartButton pattern={pattern} />
              )}

              <FreeDownloadForm patternId={pattern.id} patternName={pattern.name} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                License Information
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Commercial use allowed
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Print-on-demand permitted
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Cannot resell as digital asset
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
