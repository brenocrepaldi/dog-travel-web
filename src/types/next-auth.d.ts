import { DefaultSession } from "next-auth";

/**
 * Extend the built-in NextAuth types to include user.role and user.id.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
