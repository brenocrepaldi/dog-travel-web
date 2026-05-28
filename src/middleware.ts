import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const WALKER_ONLY = [
  "/profile/walker-profile",
  "/profile/documents",
  "/profile/bank-account",
];

const CLIENT_ONLY = [
  "/dogs",
  "/walkers",
  "/walks/new",
];

const AUTH_REQUIRED = [
  "/dashboard",
  "/walks",
  "/dogs",
  "/walkers",
  "/profile",
  "/payments",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated && AUTH_REQUIRED.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && role !== "walker" && WALKER_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthenticated && role !== "client" && CLIENT_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)" ],
};
