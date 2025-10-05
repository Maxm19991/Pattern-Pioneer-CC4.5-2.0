'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pattern Pioneer</h3>
            <p className="text-sm text-gray-600">
              Premium digital patterns for designers and creators. New patterns added weekly.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/patterns" className="text-sm text-gray-600 hover:text-gray-900">
                  All Patterns
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2">
              {!session ? (
                <>
                  <li>
                    <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-900">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-900">
                      Create Account
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/account" className="text-sm text-gray-600 hover:text-gray-900">
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/downloads" className="text-sm text-gray-600 hover:text-gray-900">
                      My Downloads
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/license" className="text-sm text-gray-600 hover:text-gray-900">
                  License Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Pattern Pioneer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="mailto:support@patternpioneerstudio.com" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
