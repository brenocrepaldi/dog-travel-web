import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

// Login schema validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Validate inputs
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // TODO: Replace with real API call to your backend
        // const user = await authenticateUser(parsed.data.email, parsed.data.password);

        // Placeholder: accept any valid credentials for development
        if (parsed.data.password === "password") {
          const role = parsed.data.email === "walker@dogtravel.com" ? "walker" : "client";
          return {
            id: role === "walker" ? "2" : "1",
            name: role === "walker" ? "Carlos Passeador" : "Usuário Teste",
            email: parsed.data.email,
            role: role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist user role in the JWT token
      if (user) {
        token.role = (user as Record<string, unknown>).role as string;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose role and id in the session
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
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
