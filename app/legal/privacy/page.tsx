import Navigation from "@/components/Navigation";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: October 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Pattern Pioneer ("we," "our," or "us") respects your privacy and is committed to protecting
              your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Account Information:</strong> Email address, name, and password</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe (we do not store card details)</li>
              <li><strong>Profile Information:</strong> Any additional information you choose to provide</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, patterns viewed</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="mb-2">We use collected information for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processing purchases and delivering digital products</li>
              <li>Managing your account and authentication</li>
              <li>Providing customer support</li>
              <li>Sending order confirmations and important account updates</li>
              <li>Improving our services and user experience</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Marketing Communications</h2>
            <p className="mb-2">
              With your consent, we may send you:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>New pattern announcements</li>
              <li>Special offers and promotions</li>
              <li>Newsletter with updates</li>
            </ul>
            <p>
              You can opt out of marketing emails at any time by clicking the unsubscribe link in any email
              or by updating your account preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
            <p className="mb-2">We may share your information with:</p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">5.1 Service Providers</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Supabase:</strong> Database and file storage</li>
              <li><strong>Vercel:</strong> Hosting services</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">5.2 Legal Requirements</h3>
            <p className="mb-2">We may disclose your information if required by law or to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Comply with legal processes or government requests</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect our rights, privacy, safety, or property</li>
              <li>Prevent fraud or security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p className="mb-2">We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Secure third-party service providers</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission over the Internet is 100% secure. While we strive to
              protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and
              comply with legal obligations. Account data is retained while your account is active. If you
              delete your account, we will delete or anonymize your information within 30 days, except where
              retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights (GDPR)</h2>
            <p className="mb-2">If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us at privacy@patternpioneerstudio.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p className="mb-2">We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential Cookies:</strong> Authentication and security</li>
              <li><strong>Functional Cookies:</strong> Remembering preferences and cart items</li>
              <li><strong>Analytics:</strong> Understanding how users interact with our site</li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling cookies may limit
              functionality of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p>
              Our Service is not directed to individuals under 18. We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside your country of
              residence. We ensure appropriate safeguards are in place to protect your data in accordance
              with this Privacy Policy and applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date. We
              encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <p className="mt-2">
              Email: privacy@patternpioneerstudio.com
            </p>
            <p className="mt-4 text-sm">
              For GDPR-related inquiries, you may also contact your local data protection authority.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
