import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// What crawlers may skip (3 Nov 2026 SEO audit): the API and admin, the thin
// /tag/* pages, the noindex /services-v2 mockup, the old /career-pathway tool
// and the MyLinks app under /projects/mylinks/ (an app, not content).
// The case study is under /case-studies. Keep the exact old URL crawlable
// so crawlers can follow its redirect; block only the legacy app children.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/api/', '/admin', '/tag/', '/services-v2', '/career-pathway', '/projects/mylinks/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
