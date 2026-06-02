import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { LoginResponseDto } from "@/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const isApiConfigured = !!process.env.NEXT_PUBLIC_API_URL;

// ─── Per-user refresh lock ────────────────────────────────────────────────────
// Prevents concurrent JWT callbacks for the same user from each firing a
// separate refresh request. All concurrent callbacks share one Promise and
// receive the same refreshed tokens, so only one rotation is written to the DB.
const refreshLocks = new Map<string, Promise<LoginResponseDto>>();

function refreshWithLock(userId: string, refreshToken: string): Promise<LoginResponseDto> {
  if (refreshLocks.has(userId)) {
    return refreshLocks.get(userId)!;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

  const promise = fetch(`${apiBase}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("REFRESH_FAILED");
      return res.json() as Promise<LoginResponseDto>;
    })
    .finally(() => refreshLocks.delete(userId));

  refreshLocks.set(userId, promise);
  return promise;
}

// ─── NextAuth config ──────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        if (isApiConfigured) {
          try {
            const { AuthApi } = await import("@/features/auth/api/auth.api");
            const result = await AuthApi.login(parsed.data.email, parsed.data.password);
            return {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              role: result.user.role,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              expiresAt: result.expiresAt,
            };
          } catch {
            return null;
          }
        }

        // Development fallback — role derived from email
        if (parsed.data.email.includes("client")) {
          return { id: "1", name: "Usuário Teste", email: parsed.data.email, role: "client" };
        }
        if (parsed.data.email.includes("walker")) {
          return { id: "1", name: "Carlos Silva", email: parsed.data.email, role: "walker" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ── Initial sign-in: persist tokens from the authorize callback ──────────
      if (user) {
        token.role = user.role ?? "";
        token.id = user.id;
        const u = user as typeof user & {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: number;
        };
        if (u.accessToken) token.accessToken = u.accessToken;
        if (u.refreshToken) token.refreshToken = u.refreshToken;
        // expiresAt is a Unix timestamp (seconds). Backend returns it from the
        // JWT exp claim; fall back to 15 min from now if missing.
        token.expiresAt = u.expiresAt ?? Math.floor(Date.now() / 1000) + 900;
        return token;
      }

      // ── Dev mode without real API — skip refresh logic ────────────────────
      if (!isApiConfigured) return token;

      // ── Access token still valid (with 60 s proactive buffer) ─────────────
      // Refreshing 60 s before actual expiry reduces the chance that multiple
      // simultaneous requests all arrive at the exact expiry boundary.
      if (Date.now() < (token.expiresAt as number) * 1000 - 60_000) return token;

      // ── No refresh token stored — cannot refresh ──────────────────────────
      if (!token.refreshToken) {
        return { ...token, error: "RefreshAccessTokenError" as const };
      }

      // ── Refresh access token via per-user lock ────────────────────────────
      // refreshWithLock guarantees that concurrent invocations for the same
      // user share one in-flight fetch instead of each firing their own,
      // which would cause the backend to rotate the refresh token multiple
      // times and invalidate all but the last stored hash.
      try {
        const refreshed = await refreshWithLock(
          token.id as string,
          token.refreshToken as string,
        );
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken ?? token.refreshToken,
          expiresAt: refreshed.expiresAt ?? Math.floor(Date.now() / 1000) + 900,
          error: undefined,
        };
      } catch {
        return { ...token, error: "RefreshAccessTokenError" as const };
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      const s = session as typeof session & { accessToken?: string; error?: string };
      s.accessToken = token.accessToken as string | undefined;
      if (token.error) s.error = token.error as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    // Align with backend refresh token lifetime so the session cookie never
    // outlives the refresh token, preventing misleading "session active" state.
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
