import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Prisma). Used by middleware to read JWT session.
 * Must match session strategy and callbacks from auth.ts so cookies are read correctly.
 */
const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [], // Not used in middleware; only for reading JWT session
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default authConfig;
