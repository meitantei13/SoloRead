import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { hostname: "books.google.com" },
      { hostname: "localhost" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
