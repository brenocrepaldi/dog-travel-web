import { handlers } from "@/lib/auth";

/**
 * NextAuth route handler.
 * Handles all /api/auth/* routes automatically.
 */
export const { GET, POST } = handlers;
