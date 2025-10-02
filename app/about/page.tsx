import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Pattern Pioneer</h1>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Welcome to Pattern Pioneer - your source for premium digital patterns.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              What We Offer
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>Premium seamless patterns in high resolution (4096×4096)</li>
              <li>Free preview versions (1024×1024) with email signup</li>
              <li>Commercial use license included</li>
              <li>New patterns added weekly</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Licensing
            </h2>
            <p className="text-gray-600 mb-4">
              All patterns come with a commercial use license. You can use them in your projects,
              including print-on-demand products. The only restriction is that you cannot resell
              the patterns as digital assets.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mt-8">
              <p className="font-semibold mb-1">Content Needed</p>
              <p className="text-sm">
                This is a placeholder page. Please add your custom content about your business,
                mission, and story here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
