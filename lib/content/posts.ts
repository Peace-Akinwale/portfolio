import { getPosts, getPostBySlug } from '@/lib/hashnode/client';
import type { HashnodePost } from '@/lib/hashnode/types';
import { listLocalArticles, getLocalArticle, mergePosts, type LocalArticle } from './articles';

// One list of posts for the blog index, the tag pages, RSS and the sitemap:
// every WordPress post plus the articles written here. If WordPress cannot be
// reached the local articles still appear, so the index never renders empty
// placeholders because a remote call failed.

export async function loadWordPressPosts(): Promise<HashnodePost[]> {
  const all: HashnodePost[] = [];
  let hasNextPage = true;
  let after: string | undefined;
  while (hasNextPage) {
    const { posts, hasNextPage: more, endCursor } = await getPosts(50, after);
    all.push(...posts);
    hasNextPage = more;
    after = endCursor;
    if (!posts.length) break;
  }
  return all;
}

export async function loadAllPosts(): Promise<{ posts: HashnodePost[]; wordpressDown: boolean }> {
  const local = listLocalArticles();
  try {
    const wp = await loadWordPressPosts();
    return { posts: mergePosts(wp, local), wordpressDown: false };
  } catch {
    return { posts: mergePosts([], local), wordpressDown: true };
  }
}

export async function loadPost(slug: string): Promise<HashnodePost | LocalArticle | null> {
  const local = getLocalArticle(slug);
  if (local) return local;
  return getPostBySlug(slug);
}

export function isLocalArticle(post: HashnodePost | LocalArticle): post is LocalArticle {
  return (post as LocalArticle).local === true;
}

// Related posts: tag overlap first, then recency; never the job-hunting post.
export const HIDDEN_FROM_RELATED = new Set(['content-manager-roles']);

export function relatedTo(post: HashnodePost, all: HashnodePost[], n = 3): HashnodePost[] {
  const tags = new Set(post.tags?.map((t) => t.slug.toLowerCase()) ?? []);
  return all
    .filter((c) => c.slug !== post.slug && !HIDDEN_FROM_RELATED.has(c.slug))
    .map((c) => ({ c, overlap: c.tags?.filter((t) => tags.has(t.slug.toLowerCase())).length ?? 0, when: new Date(c.publishedAt).getTime() }))
    .sort((a, b) => (b.overlap !== a.overlap ? b.overlap - a.overlap : b.when - a.when))
    .slice(0, n)
    .map((x) => x.c);
}
