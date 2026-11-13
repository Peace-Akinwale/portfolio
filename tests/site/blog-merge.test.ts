import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/wordpress/client', () => ({
  getPosts: vi.fn(async () => { throw new Error('WordPress unreachable'); }),
  getPostBySlug: vi.fn(async (slug: string) => (slug === 'how-to-optimize-for-aeo' ? { slug, title: 'AEO', publishedAt: '2026-04-14T00:00:00.000Z' } : null)),
}));

import { loadAllPosts, loadPost, isLocalArticle, relatedTo } from '@/lib/content/posts';
import type { WordPressPost } from '@/lib/wordpress/types';

describe('the blog with WordPress down', () => {
  it('still lists the local articles and says WordPress was down', async () => {
    const { posts, wordpressDown } = await loadAllPosts();
    expect(wordpressDown).toBe(true);
    expect(posts.map((p) => p.slug)).not.toContain('the-success-message-was-the-bug');
    expect(posts.map((p) => p.slug)).not.toContain('build-a-course-portal-around-the-instructors-workflow');
    expect(posts.every((p) => isLocalArticle(p))).toBe(true);
  });

  it('does not serve the moved course portal as an article and still serves WordPress posts', async () => {
    const local = await loadPost('build-a-course-portal-around-the-instructors-workflow');
    expect(local).toBeNull();
    const wp = await loadPost('how-to-optimize-for-aeo');
    expect(wp?.slug).toBe('how-to-optimize-for-aeo');
    expect(await loadPost('nope')).toBeNull();
    expect(await loadPost('the-success-message-was-the-bug')).toBeNull();
  });
});

describe('related posts', () => {
  const mk = (slug: string, tags: string[], date: string) => ({ slug, publishedAt: date, tags: tags.map((t) => ({ id: t, name: t, slug: t })) } as WordPressPost);
  it('prefers tag overlap, then recency, and hides the job-hunting post', () => {
    const me = mk('me', ['building'], '2026-10-01');
    const all = [me, mk('content-manager-roles', ['building'], '2025-07-15'), mk('a', ['building'], '2026-01-01'), mk('b', [], '2026-09-01'), mk('c', ['building'], '2026-05-01')];
    expect(relatedTo(me, all).map((p) => p.slug)).toEqual(['c', 'a', 'b']);
  });
});
