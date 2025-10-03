import Navigation from "@/components/Navigation";

export default function LicenseAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">License Agreement</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: October 2025</p>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Summary:</strong> You can use our patterns for commercial projects, but you cannot
              resell or redistribute the pattern files themselves. Read below for complete details.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Grant of License</h2>
            <p>
              When you purchase a pattern from Pattern Pioneer, you are granted a non-exclusive,
              non-transferable license to use the pattern file according to the terms outlined in this
              agreement. You do not acquire ownership of the pattern design itself.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Permitted Uses</h2>
            <p className="mb-2">You MAY use purchased patterns for:</p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.1 Commercial Use</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Physical products for sale (textiles, wallpaper, packaging, etc.)</li>
              <li>Digital products where the pattern is part of a larger work</li>
              <li>Client projects and commissioned work</li>
              <li>Marketing and advertising materials</li>
              <li>Website and social media graphics</li>
              <li>Book covers, album art, and editorial use</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.2 Personal Use</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Personal projects and home decor</li>
              <li>Gifts and non-commercial items</li>
              <li>Educational and academic projects</li>
              <li>Portfolio display</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.3 Modifications</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Edit, modify, or manipulate the pattern</li>
              <li>Change colors, scale, or arrangement</li>
              <li>Combine with other elements in your designs</li>
              <li>Create derivative works for the permitted uses above</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Prohibited Uses</h2>
            <p className="mb-2">You MAY NOT:</p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3.1 Redistribution</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Resell, redistribute, or share the original pattern files</li>
              <li>Offer the patterns as free downloads</li>
              <li>Include patterns in any collection or bundle for sale</li>
              <li>Share your account access or downloads with others</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3.2 Standalone Digital Products</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Sell the pattern as a digital download or print-on-demand file</li>
              <li>Create seamless pattern products (wallpaper, fabric) for digital sale where the pattern is the primary product</li>
              <li>Use in templates, themes, or products where end users receive the pattern file</li>
              <li>Sublicense or transfer your license to others</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3.3 Intellectual Property Claims</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Register the pattern or any derivative as a trademark</li>
              <li>Claim ownership or authorship of the original design</li>
              <li>Use in a way that implies Pattern Pioneer endorsement without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Physical Products Clarification</h2>
            <p className="mb-2">
              <strong>You CAN sell physical items featuring the pattern:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Printed textiles (clothing, home goods, upholstery)</li>
              <li>Printed wallpaper and wall decor</li>
              <li>Packaging and product design</li>
              <li>Stationery and paper goods</li>
              <li>Ceramics, phone cases, and other merchandise</li>
            </ul>
            <p className="mt-3">
              There is <strong>no limit</strong> on the number of physical items you can produce and sell.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Print-on-Demand Services</h2>
            <p className="mb-2">
              You may use patterns with print-on-demand services (Printful, Printify, etc.) with the
              following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The pattern is applied to physical products only</li>
              <li>End customers receive printed products, not digital files</li>
              <li>You use secure upload methods that don't expose files publicly</li>
              <li>You are responsible for ensuring the POD service's compliance with this license</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Attribution</h2>
            <p>
              Attribution is not required but appreciated. If you choose to credit Pattern Pioneer:
            </p>
            <p className="mt-2 italic">
              "Pattern by Pattern Pioneer - patternpioneerstudio.com"
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. License Scope</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Per-Pattern:</strong> This license applies to each individual pattern purchased</li>
              <li><strong>Perpetual:</strong> The license does not expire</li>
              <li><strong>Non-Transferable:</strong> The license cannot be transferred to another person or entity</li>
              <li><strong>Personal:</strong> The license is granted to you as an individual or single business entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Multiple Users / Team License</h2>
            <p>
              If you need to share patterns with team members or across multiple locations, please
              contact us at licensing@patternpioneerstudio.com for extended licensing options.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Enforcement and Violations</h2>
            <p className="mb-2">Violations of this license may result in:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Immediate termination of your license</li>
              <li>Account suspension or deletion</li>
              <li>Legal action to protect our intellectual property</li>
              <li>Claims for damages and legal fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Warranty Disclaimer</h2>
            <p>
              Patterns are provided "as is" without warranty of any kind. Pattern Pioneer does not
              guarantee that patterns will be error-free or suitable for any particular purpose. We
              are not liable for any damages arising from the use of our patterns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Updates to License</h2>
            <p>
              We may update this License Agreement from time to time. Changes will not affect patterns
              purchased before the update. The license terms in effect at the time of purchase govern
              your use of that pattern.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Questions and Permissions</h2>
            <p className="mb-2">
              If you're unsure whether your intended use is permitted, or if you need special
              permissions beyond this license, please contact us:
            </p>
            <p className="mt-2">
              Email: licensing@patternpioneerstudio.com
            </p>
            <p className="mt-3 text-sm">
              We're happy to discuss custom licensing arrangements for uses not covered by this
              standard license.
            </p>
          </section>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-8">
            <h3 className="font-semibold text-green-900 mb-2">Quick Reference</h3>
            <p className="text-sm text-green-900 mb-2">✓ YES - Sell physical products with patterns</p>
            <p className="text-sm text-green-900 mb-2">✓ YES - Use in client work and commercial projects</p>
            <p className="text-sm text-green-900 mb-2">✓ YES - Modify and edit patterns</p>
            <p className="text-sm text-red-900 mb-2">✗ NO - Resell or share the pattern files</p>
            <p className="text-sm text-red-900">✗ NO - Sell as standalone digital downloads</p>
          </div>
        </div>
      </main>
    </div>
  );
}
