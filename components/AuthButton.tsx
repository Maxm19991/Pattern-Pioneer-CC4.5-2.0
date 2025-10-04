'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (status === 'loading') {
    return (
      <div className="bg-gray-200 animate-pulse rounded-full w-9 h-9 sm:w-10 sm:h-10" />
    );
  }

  if (session) {
    // Get user initials for avatar
    const userEmail = session.user?.email || '';
    const userName = session.user?.name || userEmail;
    const initials = userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || userEmail[0]?.toUpperCase() || 'U';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base rounded-full bg-gray-900 text-white font-semibold flex items-center justify-center hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          aria-label="User menu"
        >
          {initials}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Account Settings
              </Link>
              <Link
                href="/account/downloads"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                My Downloads
              </Link>
              <Link
                href="/account/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Purchase History
              </Link>
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-200 py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="bg-gray-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg hover:bg-gray-800 transition"
    >
      Sign In
    </Link>
  );
}
