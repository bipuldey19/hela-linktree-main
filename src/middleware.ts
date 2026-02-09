import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import authConfig from "@/lib/auth.config";

// Use edge-compatible config (same JWT/callbacks as auth.ts, no Prisma)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isLoginPage) return;
  if (!isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
