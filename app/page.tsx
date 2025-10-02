import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { getPatterns } from "@/lib/data/patterns";

export default async function Home() {
  const allPatterns = await getPatterns();
  // Get 6 featured patterns
  const featuredPatterns = allPatterns.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Beautiful Patterns for
            <br />
            Creative Projects
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Download premium seamless patterns for your design work.
            Commercial use allowed. New patterns every week.
          </p>

          <Link
            href="/patterns"
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
          >
            Browse All Patterns
          </Link>
        </div>

        {/* Featured Patterns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {featuredPatterns.map((pattern) => (
            <Link
              key={pattern.id}
              href={`/patterns/${pattern.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={pattern.image_url}
                alt={pattern.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Newsletter Section */}
        <div id="newsletter" className="max-w-md mx-auto border border-gray-200 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Get 4 New Patterns Weekly
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Join our newsletter for updates on new pattern releases
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Pattern Pioneer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
