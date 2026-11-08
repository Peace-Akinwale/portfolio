import { loadAllPosts } from '@/lib/content/posts';

export const revalidate = 3600;

export async function GET() {
  const { posts } = await loadAllPosts();
  const baseUrl = 'https://peaceakinwale.com';

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      // Keep item identity stable for existing subscribers after the URL move.
      const guid = `${baseUrl}/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const description = post.seo?.description || post.brief || '';
      const escapedDesc = description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedTitle = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `    <item>
      <title>${escapedTitle}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${guid}</guid>
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
    <description>Articles by Peace Akinwale on writing for B2B SaaS companies, AI search, and building tools with AI coding agents.</description>
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
