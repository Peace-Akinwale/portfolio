import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://peaceakinwale.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/test/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
