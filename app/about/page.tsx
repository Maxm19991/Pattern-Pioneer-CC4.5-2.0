import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Pattern Pioneer</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Creating high-quality seamless patterns for designers, makers, and creative professionals worldwide.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Mission */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            At Pattern Pioneer, we believe that beautiful design should be accessible to everyone.
            Our mission is to provide high-quality, unique seamless patterns that empower designers,
            small businesses, and creative entrepreneurs to bring their visions to life.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Whether you're designing products for your online store, creating marketing materials,
            or working on client projects, our patterns are crafted to elevate your work and save you time.
          </p>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                All patterns are delivered in high-resolution 4096×4096 PNG format,
                perfect for both digital and print applications.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Commercial License</h3>
              <p className="text-gray-600">
                Every purchase includes a commercial use license. Use our patterns in unlimited
                projects, products, and client work.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Weekly Updates</h3>
              <p className="text-gray-600">
                Fresh patterns added every week. Subscribe to our newsletter to stay updated
                on new releases and special offers.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Try Before You Buy</h3>
              <p className="text-gray-600">
                Download free 1024×1024 preview versions of any pattern to test in your
                projects before purchasing.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Standards */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality Standards</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Seamless Perfection</h3>
                <p className="text-gray-600">
                  Every pattern is meticulously crafted to tile perfectly with no visible seams,
                  ensuring professional results every time.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Original Designs</h3>
                <p className="text-gray-600">
                  All patterns are created in-house, ensuring unique designs you won't find anywhere else.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Print & Digital Ready</h3>
                <p className="text-gray-600">
                  Optimized for both screen and print applications, from websites to fabric printing
                  and everything in between.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Perfect For</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Textile and fabric design
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Product packaging
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Website backgrounds
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Print-on-demand products
              </li>
            </ul>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Social media graphics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Wallpaper and home decor
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Stationery and paper goods
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
                Marketing materials
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Simple, Fair Pricing</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">€6.99</h3>
                <p className="text-gray-600">per pattern</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">4096×4096 PNG</p>
                <p className="text-sm text-gray-600">Commercial license included</p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Instant download
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Lifetime access and re-downloads
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Use in unlimited projects
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Need custom licensing or have questions? <a href="mailto:licensing@patternpioneerstudio.com" className="text-gray-900 hover:underline">Contact us</a>
          </p>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We're here to help! Whether you have questions about licensing, need technical support,
            or want to discuss custom projects, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@patternpioneerstudio.com"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Support
            </a>
            <Link
              href="/patterns"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Browse Patterns
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
