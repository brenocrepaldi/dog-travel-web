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
        // Store backend tokens when coming from a real API login
        const u = user as typeof user & { accessToken?: string; refreshToken?: string };
        if (u.accessToken) token.accessToken = u.accessToken;
        if (u.refreshToken) token.refreshToken = u.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      // Expose accessToken so the Axios interceptor can inject it
      (session as typeof session & { accessToken?: string }).accessToken =
        token.accessToken as string | undefined;
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
