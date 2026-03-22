import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Next.js Proxy (formerly Middleware) using Auth.js.
 * Protects authenticated routes and redirects appropriately.
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/walk") ||
    nextUrl.pathname.startsWith("/chat") ||
    nextUrl.pathname.startsWith("/profile");

  // Already logged in and trying to access auth pages → redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Not logged in and trying to access protected routes → redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run on all routes except static assets and Next.js internals
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
