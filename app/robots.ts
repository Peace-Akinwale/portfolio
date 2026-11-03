import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// What crawlers may skip (3 Nov 2026 SEO audit): the API and admin, the thin
// /tag/* pages, the noindex /services-v2 mockup, the old /career-pathway tool
// and the MyLinks app under /projects/mylinks/ (an app, not content; its
// landing page at /projects/mylinks stays crawlable).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/tag/', '/services-v2', '/career-pathway', '/projects/mylinks/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
