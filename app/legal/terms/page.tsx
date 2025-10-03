import Navigation from "@/components/Navigation";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: October 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using Pattern Pioneer ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p>
              Pattern Pioneer provides digital pattern files for purchase and download. Patterns are available for
              one-time purchase at €6.99 per pattern, delivered as 4096×4096 pixel PNG files.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="mb-2">To purchase patterns, you must:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create an account with a valid email address</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
            </ul>
            <p className="mt-3">
              You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Purchases and Payments</h2>
            <p className="mb-2">All purchases are subject to the following terms:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prices are listed in Euros (€) and are subject to change</li>
              <li>Payment is processed securely through Stripe</li>
              <li>All sales are final - no refunds except as required by law</li>
              <li>You will receive instant access to download purchased patterns</li>
              <li>You may re-download purchased patterns at any time from your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Digital Products</h2>
            <p className="mb-2">
              All patterns are digital products delivered electronically. By purchasing, you acknowledge:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Patterns are delivered as downloadable PNG files (4096×4096 pixels)</li>
              <li>Files are delivered immediately upon successful payment</li>
              <li>You are responsible for downloading and storing your files</li>
              <li>We maintain download access through your account but recommend keeping backups</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refund Policy</h2>
            <p>
              Due to the nature of digital products, all sales are final. We do not offer refunds except
              in cases of technical errors preventing download or as required by applicable law. If you
              experience technical difficulties, please contact us at support@patternpioneerstudio.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. License and Usage Rights</h2>
            <p>
              Your use of purchased patterns is governed by our License Agreement. Please review the
              License Agreement for detailed information about permitted and prohibited uses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="mb-2">All patterns and content on Pattern Pioneer are protected by copyright and other intellectual property laws:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Patterns remain the intellectual property of Pattern Pioneer</li>
              <li>Purchase grants you a license to use, not ownership of the design</li>
              <li>Unauthorized distribution or resale is strictly prohibited</li>
              <li>Trademark and service marks are owned by Pattern Pioneer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Prohibited Conduct</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Share, redistribute, or resell purchased patterns</li>
              <li>Use patterns in violation of the License Agreement</li>
              <li>Attempt to circumvent payment or security measures</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Service Availability</h2>
            <p>
              We strive to maintain Service availability but do not guarantee uninterrupted access.
              We reserve the right to modify, suspend, or discontinue the Service at any time with
              or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Pattern Pioneer shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages resulting from your
              use or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at any time for violations
              of these Terms. Upon termination, your right to use the Service will immediately cease,
              though you retain the right to use patterns purchased prior to termination per the License Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by
              posting the new Terms on this page and updating the "Last updated" date. Your continued
              use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the European Union
              and the Netherlands, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: support@patternpioneerstudio.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
