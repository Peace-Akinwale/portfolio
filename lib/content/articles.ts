import fs from 'node:fs';
import path from 'node:path';
import { parseFrontMatter, asString, asList } from './frontmatter';
import { renderMarkdown, readingMinutes, imageRefs } from './markdown';
import type { HashnodePost } from '@/lib/hashnode/types';

// Articles written here rather than on WordPress live in content/articles/<slug>.md
// with images in public/articles/<slug>/. They appear in the blog index and at
// /<slug> beside the WordPress posts, in the same shape (HashnodePost), so the
// index, RSS and article page need no second code path. Front matter:
//   title, date (YYYY-MM-DD), standfirst (the index summary), tags (list),
//   cover (file name), cover_alt, review (optional note shown only in dev).

export interface LocalArticle extends HashnodePost {
  local: true;
  review?: string;
  images: string[];
}

export const ARTICLE_DIR = path.join(process.cwd(), 'content', 'articles');
export const ARTICLE_PUBLIC = (slug: string) => `/articles/${slug}`;

export function readArticleFile(file: string): LocalArticle {
  const slug = path.basename(file, '.md');
  const src = fs.readFileSync(file, 'utf8');
  const { data, body } = parseFrontMatter(src);
  const imageBase = ARTICLE_PUBLIC(slug);
  const html = renderMarkdown(body, { imageBase });
  const date = asString(data.date);
  const iso = date ? new Date(`${date}T09:00:00Z`).toISOString() : new Date(0).toISOString();
  const cover = data.cover ? asString(data.cover) : '';
  const tags = asList(data.tags).map((name) => ({ id: name, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
  return {
    local: true,
    id: `local-${slug}`,
    title: asString(data.title, slug),
    brief: asString(data.standfirst),
    slug,
    content: { markdown: body, html },
    coverImage: cover ? { url: `${imageBase}/${cover}` } : undefined,
    publishedAt: iso,
    updatedAt: iso,
    readTimeInMinutes: readingMinutes(body),
    tags,
    author: { name: 'Peace Akinwale' },
    seo: { title: asString(data.title, slug), description: asString(data.standfirst) },
    url: `https://peaceakinwale.com/blog/${slug}`,
    review: data.review ? asString(data.review) : undefined,
    images: imageRefs(body).map((p) => /^(https?:\/\/|\/)/.test(p) ? p : `${imageBase}/${p.replace(/^(\.\/)?images\/[^/]+\//, '').replace(/^\.\//, '')}`),
  };
}

export function listLocalArticles(): LocalArticle[] {
  if (!fs.existsSync(ARTICLE_DIR)) return [];
  return fs
    .readdirSync(ARTICLE_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readArticleFile(path.join(ARTICLE_DIR, f)))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getLocalArticle(slug: string): LocalArticle | null {
  const file = path.join(ARTICLE_DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  return readArticleFile(file);
}

// WordPress posts and local articles in one list, newest first. A local slug
// that also exists on WordPress wins, so a piece moved here never shows twice.
export function mergePosts(wordpress: HashnodePost[], local: LocalArticle[]): HashnodePost[] {
  const localSlugs = new Set(local.map((a) => a.slug));
  const rest = wordpress.filter((p) => !localSlugs.has(p.slug));
  return [...local, ...rest].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0));
}
