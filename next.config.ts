import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/case-studies/aloud', destination: '/case-studies/read-aloud', permanent: true },
      { source: '/images/approved/aloud/:path*', destination: '/images/approved/read-aloud/:path*', permanent: true },
      {
        source: '/blog/build-a-course-portal-around-the-instructors-workflow',
        destination: '/case-studies/build-a-course-portal-around-the-instructors-workflow',
        permanent: true,
      },
      {
        source: '/build-a-course-portal-around-the-instructors-workflow',
        destination: '/case-studies/build-a-course-portal-around-the-instructors-workflow',
        permanent: true,
      },
      // www is served by the same Railway service so https://www links keep
      // working; one permanent hop to the canonical root (29 Oct 2026).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.peaceakinwale.com' }],
        destination: 'https://peaceakinwale.com/:path*',
        permanent: true,
      },
      {
        source: '/how-to-write-sales-enablement-content',
        destination: '/blog/sales-enablement-content-strategy',
        permanent: true,
      },
      // 8 Nov 2026: the client writing pages moved under /writing.
      { source: '/b2b-content-for-manyrequests', destination: '/writing/manyrequests', permanent: true },
      { source: '/content-for-highervisibility', destination: '/writing/highervisibility', permanent: true },
      { source: '/content-for-pangea', destination: '/writing/pangea', permanent: true },
      // 8 Nov 2026: the writing samples page moved from /portfolio to /writing.
      {
        source: '/portfolio',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/page/about',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/page/portfolio',
        destination: '/writing',
        permanent: true,
      },
      // The projects index and the contentDB project page moved to the case
      // studies. MyLinks moves only its exact overview URL; nested app routes
      // remain available for existing workspace links and OAuth callbacks.
      {
        source: '/projects',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/projects/contentdb',
        destination: '/case-studies/contentdb',
        permanent: true,
      },
      {
        // 4 Nov 2026: the Marker.io samples now sit on the writing page.
        source: '/b2b-content-for-marker.io',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/tools',
        destination: '/case-studies',
        permanent: true,
      },
      { source: '/projects/mylinks', destination: '/case-studies/mylinks', permanent: true },
      { source: '/tools/mylinks', destination: '/case-studies/mylinks', permanent: true },
      {
        source: '/tools/mylinks/:path*',
        destination: '/projects/mylinks/:path*',
        permanent: true,
      },
      // Straight to the case study, not through /projects/contentdb (no chain).
      {
        source: '/contentdb',
        destination: '/case-studies/contentdb',
        permanent: true,
      },
      // A noindex mockup of the services page; the real page is /services.
      {
        source: '/services-v2',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/mylinks',
        destination: '/case-studies/mylinks',
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
    qualities: [75, 90],
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
