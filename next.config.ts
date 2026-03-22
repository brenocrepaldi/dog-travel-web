import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Allow external image domains (used for user avatars, pet photos, map tiles, etc.)
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  /**
   * Turbopack config (Next.js 16 default bundler).
   * Empty object signals we're aware and opted in.
   */
  turbopack: {},
};

export default nextConfig;
