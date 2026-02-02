import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com',
      },
    ],
  },
  experimental: {
    turbo: {
      // Disable Turbopack for production builds to avoid build errors
      enabled: false,
    },
  },
};

export default nextConfig;
