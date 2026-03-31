import { getPosts } from '@/lib/hashnode/client';

export const revalidate = 3600;

export async function GET() {
  const { posts } = await getPosts(50);
  const baseUrl = 'https://peaceakinwale.com';

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const description = post.seo?.description || post.brief || '';
      const escapedDesc = description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedTitle = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `    <item>
      <title>${escapedTitle}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapedDesc}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Peace Akinwale</title>
    <link>${baseUrl}</link>
    <description>B2B SaaS content writing insights — articles on product-led content, content refreshes, SEO, and AI search.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
