import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = !!(auth?.user as any)?.isAdmin;
      const isOnAccount = nextUrl.pathname.startsWith('/account');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      // Admin routes require admin role
      if (isOnAdmin) {
        if (!isLoggedIn || !isAdmin) {
          return false; // Redirect non-admin users
        }
        return true;
      }

      // Account routes require authentication
      if (isOnAccount) {
        if (!isLoggedIn) {
          return false; // Redirect unauthenticated users to login page
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
