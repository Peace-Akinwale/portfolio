// The real WordPress client; only global fetch is stubbed. The older blog test
// mocks getPosts itself, which the real client never made throw.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const post = (id: number, slug: string) => ({ ID: id, date: '2026-01-01T00:00:00+00:00', modified: '2026-01-01T00:00:00+00:00', title: slug, URL: `https://x/${slug}`, content: '<p>x</p>', excerpt: '', slug, tags: {}, author: { name: 'P' } });
const ok = (posts: unknown[]) => new Response(JSON.stringify({ posts }), { status: 200, headers: { 'content-type': 'application/json' } });

describe('WordPress client', () => {
  beforeEach(() => { vi.resetModules(); vi.useFakeTimers(); process.env.WORDPRESS_SITE = 'example.wordpress.com'; vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('says WordPress is down, and does not call a real post missing, when the first fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('down', { status: 503 })));
    const { loadAllPosts, loadPost } = await import('@/lib/content/posts');
    expect((await loadAllPosts()).wordpressDown).toBe(true);
    await expect(loadPost('how-to-optimize-for-aeo')).rejects.toThrow();
  });

  it('picks up a new post after five minutes, and at once when the cache is cleared', async () => {
    let posts = [post(1, 'first')];
    vi.stubGlobal('fetch', vi.fn(async () => ok(posts)));
    const { getAllPostSlugs, clearWordPressCache } = await import('@/lib/wordpress/client');
    expect(await getAllPostSlugs()).toEqual(['first']);
    posts = [post(2, 'second'), post(1, 'first')];
    expect(await getAllPostSlugs()).toEqual(['first']);
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(await getAllPostSlugs()).toContain('second');
    posts = [post(3, 'third'), ...posts];
    clearWordPressCache();
    expect(await getAllPostSlugs()).toContain('third');
  });

  it('keeps serving the last good list when a refresh fails', async () => {
    let down = false;
    vi.stubGlobal('fetch', vi.fn(async () => (down ? new Response('down', { status: 503 }) : ok([post(1, 'first')]))));
    const { getPostBySlug } = await import('@/lib/wordpress/client');
    expect((await getPostBySlug('first'))?.slug).toBe('first');
    down = true;
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect((await getPostBySlug('first'))?.slug).toBe('first');
  });
});
