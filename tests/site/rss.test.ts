import { describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/rss.xml/route';

vi.mock('@/lib/content/posts', () => ({
  loadAllPosts: vi.fn().mockResolvedValue({
    posts: [{
      slug: 'how-to-optimize-for-aeo',
      title: 'Research & writing',
      brief: 'Use <sources> & check them.',
      publishedAt: '2026-04-14T00:00:00.000Z',
    }],
  }),
}));

describe('RSS article URL migration', () => {
  it('links to the blog route without announcing an existing article as a new item', async () => {
    const response = await GET();
    const xml = await response.text();
    expect(xml).toContain('<link>https://peaceakinwale.com/blog/how-to-optimize-for-aeo</link>');
    expect(xml).toContain('<guid isPermaLink="true">https://peaceakinwale.com/how-to-optimize-for-aeo</guid>');
    expect(xml).toContain('<title>Research &amp; writing</title>');
    expect(xml).toContain('<description>Use &lt;sources&gt; &amp; check them.</description>');
  });
});
