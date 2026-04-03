import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/how-to-write-sales-enablement-content',
        destination: '/sales-enablement-content-strategy',
        permanent: true,
      },
      {
        source: '/page/about',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/page/portfolio',
        destination: '/portfolio',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
