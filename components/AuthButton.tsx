'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="bg-gray-200 animate-pulse px-4 py-2 rounded-lg w-20 h-10" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/account"
          className="text-gray-700 hover:text-gray-900"
        >
          Account
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-gray-700 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
    >
      Sign In
    </Link>
  );
}
