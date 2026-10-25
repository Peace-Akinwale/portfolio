import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/hashnode/client', () => ({
  getPosts: vi.fn(async () => { throw new Error('WordPress unreachable'); }),
  getPostBySlug: vi.fn(async (slug: string) => (slug === 'how-to-optimize-for-aeo' ? { slug, title: 'AEO', publishedAt: '2026-04-14T00:00:00.000Z' } : null)),
}));

import { loadAllPosts, loadPost, isLocalArticle, relatedTo } from '@/lib/content/posts';
import type { HashnodePost } from '@/lib/hashnode/types';

describe('the blog with WordPress down', () => {
  it('still lists the local articles and says WordPress was down', async () => {
    const { posts, wordpressDown } = await loadAllPosts();
    expect(wordpressDown).toBe(true);
    expect(posts.map((p) => p.slug)).toContain('the-success-message-was-the-bug');
    expect(posts.every((p) => isLocalArticle(p))).toBe(true);
  });

  it('serves a local article first and a WordPress post otherwise', async () => {
    const local = await loadPost('the-success-message-was-the-bug');
    expect(local && isLocalArticle(local)).toBe(true);
    const wp = await loadPost('how-to-optimize-for-aeo');
    expect(wp?.slug).toBe('how-to-optimize-for-aeo');
    expect(await loadPost('nope')).toBeNull();
  });
});

describe('related posts', () => {
  const mk = (slug: string, tags: string[], date: string) => ({ slug, publishedAt: date, tags: tags.map((t) => ({ id: t, name: t, slug: t })) } as HashnodePost);
  it('prefers tag overlap, then recency, and hides the job-hunting post', () => {
    const me = mk('me', ['building'], '2026-10-01');
    const all = [me, mk('content-manager-roles', ['building'], '2025-07-15'), mk('a', ['building'], '2026-01-01'), mk('b', [], '2026-09-01'), mk('c', ['building'], '2026-05-01')];
    expect(relatedTo(me, all).map((p) => p.slug)).toEqual(['c', 'a', 'b']);
  });
});
