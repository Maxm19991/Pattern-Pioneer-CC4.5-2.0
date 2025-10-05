import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { authConfig } from './auth.config';
import { getSupabaseClient } from './lib/supabase';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const supabase = getSupabaseClient();

        // Check if user exists
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !user) {
          return null;
        }

        // Verify password
        if (!user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.is_admin || false,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Add is_admin to token on sign in
      if (user) {
        token.isAdmin = (user as any).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      // Add is_admin to session
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
});
