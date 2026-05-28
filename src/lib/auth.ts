import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const isApiConfigured = !!process.env.NEXT_PUBLIC_API_URL;

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
        // expiresAt is a Unix timestamp (seconds). Backend should return it; default to 1h.
        token.expiresAt = u.expiresAt ?? Math.floor(Date.now() / 1000) + 3600;
        return token;
      }

      // Return token unchanged when API is not configured (dev mode with mock data)
      if (!isApiConfigured) return token;

      // Access token still valid — nothing to do
      if (Date.now() < (token.expiresAt as number) * 1000) return token;

      // Access token expired — attempt refresh
      if (!token.refreshToken) {
        return { ...token, error: "RefreshAccessTokenError" as const };
      }

      try {
        const { AuthApi } = await import("@/features/auth/api/auth.api");
        const refreshed = await AuthApi.refreshToken(token.refreshToken as string);
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken ?? token.refreshToken,
          expiresAt: refreshed.expiresAt ?? Math.floor(Date.now() / 1000) + 3600,
          error: undefined,
        };
      } catch {
        // Refresh failed — user will be redirected on the next 401 from the API
        return { ...token, error: "RefreshAccessTokenError" as const };
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      const s = session as typeof session & { accessToken?: string; error?: string };
      // Expose accessToken so the Axios interceptor can inject it
      s.accessToken = token.accessToken as string | undefined;
      // Expose refresh error so the interceptor can redirect to login
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
