import { getPatternBySlug, getPatterns } from "@/lib/data/patterns";
import Navigation from "@/components/Navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PatternPageProps {
  params: {
    slug: string;
  };
}

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Pattern Preview with Tiling */}
          <div>
            <div className="sticky top-24">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={{
                    height: '600px',
                    backgroundImage: `url(${pattern.image_url})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '300px 300px',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Seamless tiling preview
                </p>
              </div>
            </div>
          </div>

          {/* Right: Pattern Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {pattern.name}
            </h1>
            <p className="text-gray-600 mb-6">{pattern.description}</p>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  €{pattern.price.toFixed(2)}
                </span>
                <span className="text-gray-500">4096×4096 PNG</span>
              </div>

              <AddToCartButton pattern={pattern} />

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Get Free Version (1024×1024)
                </h3>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                  >
                    Download
                  </button>
                </form>
              </div>
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
