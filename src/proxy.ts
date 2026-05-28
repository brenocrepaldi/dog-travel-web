import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const WALKER_ONLY = ["/profile/walker-profile", "/profile/documents", "/profile/bank-account"];
const CLIENT_ONLY = ["/dogs", "/walkers", "/walks/new"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const role = session?.user?.role;
  const { pathname } = nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/walk") ||
    pathname.startsWith("/dogs") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/profile");

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && role !== "walker" && WALKER_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isLoggedIn && role !== "client" && CLIENT_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Run on all routes except static assets and Next.js internals
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
