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
      {
        source: '/tools',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/tools/mylinks/:path*',
        destination: '/projects/mylinks/:path*',
        permanent: true,
      },
      {
        source: '/contentdb',
        destination: '/projects/contentdb',
        permanent: true,
      },
      {
        source: '/mylinks',
        destination: '/projects/mylinks',
        permanent: true,
      },
      {
        source: '/linkedin-router',
        destination: '/projects/linkedin-router',
        permanent: true,
      },
      {
        source: '/mystyleguide',
        destination: '/projects/mystyleguide',
        permanent: true,
      },
      {
        source: '/portfolio-project',
        destination: '/projects/portfolio-project',
        permanent: true,
      },
      {
        source: '/editorial-style-guide',
        destination: '/projects/editorial-style-guide',
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
