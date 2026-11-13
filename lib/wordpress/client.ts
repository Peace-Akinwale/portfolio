import type { WordPressPage, WordPressPost } from './types';

const WORDPRESS_SITE = process.env.WORDPRESS_SITE;
const CUSTOM_SITE_URL = 'https://peaceakinwale.com';

const DEFAULT_AUTHOR: WordPressPost['author'] = {
  name: 'Peace Akinwale',
  profilePicture: undefined,
  bio: {
    text: 'B2B SaaS content writer for product-led software companies. I write articles that rank, refresh content with business potential, and help brands show up in AI search.',
  },
};

const LOCAL_COVER_IMAGE_OVERRIDES: Record<string, string> = {
  'what-i-learned-vibe-coding-my-first-app-shutting-it-down': '/images/blog/garde-logo.jpg',
  'how-to-build-portfolio-website-claude-code': '/images/blog/second-thorough-prompt.png',
};

interface WordPressTag {
  ID?: number;
  name: string;
  slug?: string;
}

interface WordPressAuthor {
  name?: string;
  avatar_URL?: string;
  bio?: string;
}

interface WordPressPublicPost {
  ID: number;
  date: string;
  modified: string;
  title: string;
  URL: string;
  content: string;
  excerpt?: string;
  slug: string;
  featured_image?: string;
  tags?: Record<string, WordPressTag>;
  author?: WordPressAuthor;
}

interface WordPressPublicPage {
  ID: number;
  title: string;
  slug: string;
  content: string;
}

interface WordPressCollectionResponse<T> {
  posts: T[];
  meta?: {
    next_page?: string;
  };
}

let wordpressPostsPromise: Promise<WordPressPost[]> | null = null;
let wordpressPagesPromise: Promise<WordPressPage[]> | null = null;

function decodeHtmlEntities(input: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    mdash: '-',
    ndash: '-',
    hellip: '...',
  };

  return input.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (_, entity: string) => {
    if (entity.startsWith('#x')) {
      return String.fromCodePoint(parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith('#')) {
      return String.fromCodePoint(parseInt(entity.slice(1), 10));
    }

    return namedEntities[entity] ?? `&${entity};`;
  });
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePlainText(input?: string): string {
  return decodeHtmlEntities(input ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateReadingTime(html: string): number {
  const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

function extractFirstImageUrl(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function mapWordPressTags(tags?: Record<string, WordPressTag>) {
  return Object.values(tags ?? {}).map((tag) => ({
    id: String(tag.ID ?? tag.slug ?? tag.name),
    name: decodeHtmlEntities(tag.name),
    slug: (tag.slug ?? tag.name.toLowerCase().replace(/\s+/g, '-')).toLowerCase(),
  }));
}

function mapWordPressAuthor(author?: WordPressAuthor): WordPressPost['author'] {
  if (!author?.name) {
    return DEFAULT_AUTHOR;
  }

  return {
    name: decodeHtmlEntities(author.name),
    profilePicture: author.avatar_URL,
    bio: author.bio ? { text: normalizePlainText(author.bio) } : DEFAULT_AUTHOR.bio,
  };
}

// WordPress bodies link to the site by its absolute URL, some over http and some
// through www (e.g. http://peaceakinwale.com/services, https://www.peaceakinwale.com/portfolio/).
// Rewrite those hrefs to root-relative paths so every internal link resolves on
// the current origin over https and points at the one canonical URL.
export function relativizeSiteLinks(html: string): string {
  return html.replace(
    /(\bhref=)(["'])https?:\/\/(?:www\.)?peaceakinwale\.com(\/[^"']*)?\2/gi,
    (_m, attr: string, quote: string, rest: string | undefined) => `${attr}${quote}${rest || '/'}${quote}`,
  );
}

// WordPress turns a bare tool name into a link: "Next.js" becomes
// <a href="http://next.js">Next.js</a>, and the same for Node.js and Sanity.io.
// A real link has a path (https://www.sanity.io/headless-cms) and is left alone.
const BARE_TOOL_NAME = /^(?:next\.js|node\.js|sanity(?:\.io)?)$/i;

export function unwrapBareToolLinks(html: string): string {
  return html.replace(/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi, (full, attrs: string, inner: string) => {
    const href = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const raw = href?.[1] ?? href?.[2];
    if (!raw) return full;
    let host = '';
    let pathName = '';
    try {
      const url = new URL(raw);
      host = url.hostname.replace(/^www\./i, '').toLowerCase();
      pathName = url.pathname.replace(/\/+$/, '');
      if (url.search || url.hash) return full;
    } catch {
      return full;
    }
    if (host !== 'next.js' && host !== 'node.js' && host !== 'sanity.io') return full;
    if (pathName) return full;
    const text = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    if (!BARE_TOOL_NAME.test(text)) return full;
    return text;
  });
}

function prepareWordPressHtml(html: string): string {
  return unwrapBareToolLinks(relativizeSiteLinks(html));
}

function buildPostFromWordPress(raw: WordPressPublicPost): WordPressPost {
  const excerptSource = raw.excerpt?.trim() ? raw.excerpt : raw.content;
  const summary = normalizePlainText(stripHtml(excerptSource)).slice(0, 240).trim();
  const title = normalizePlainText(raw.title);
  const coverUrl =
    LOCAL_COVER_IMAGE_OVERRIDES[raw.slug] ||
    raw.featured_image ||
    extractFirstImageUrl(raw.content);

  return {
    id: String(raw.ID),
    title,
    brief: summary,
    slug: raw.slug,
    content: {
      markdown: '',
      html: prepareWordPressHtml(raw.content),
    },
    coverImage: coverUrl ? { url: coverUrl } : undefined,
    publishedAt: raw.date,
    updatedAt: raw.modified,
    readTimeInMinutes: estimateReadingTime(raw.content),
    tags: mapWordPressTags(raw.tags),
    author: mapWordPressAuthor(raw.author),
    seo: {
      title,
      description: summary,
    },
    url: `${CUSTOM_SITE_URL}/blog/${raw.slug}`,
  };
}

function buildPageFromWordPress(raw: WordPressPublicPage): WordPressPage {
  return {
    id: String(raw.ID),
    title: decodeHtmlEntities(raw.title),
    slug: raw.slug,
    content: {
      markdown: '',
      html: prepareWordPressHtml(raw.content),
    },
  };
}

async function requestWordPressCollection<T>(path: string, params: URLSearchParams): Promise<WordPressCollectionResponse<T>> {
  if (!WORDPRESS_SITE) {
    return { posts: [] };
  }

  const response = await fetch(
    `https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(WORDPRESS_SITE)}/${path}?${params.toString()}`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}`);
  }

  return (await response.json()) as WordPressCollectionResponse<T>;
}

async function fetchWordPressPosts(): Promise<WordPressPost[]> {
  if (!WORDPRESS_SITE) {
    return [];
  }

  if (!wordpressPostsPromise) {
    wordpressPostsPromise = (async () => {
      const allPosts: WordPressPublicPost[] = [];
      let nextPage: string | undefined;

      do {
        const params = new URLSearchParams({
          number: '100',
          order_by: 'date',
          order: 'DESC',
          fields: 'ID,date,modified,title,URL,content,excerpt,slug,featured_image,tags,author',
        });

        if (nextPage) {
          params.set('page_handle', nextPage);
        }

        const data = await requestWordPressCollection<WordPressPublicPost>('posts/', params);
        allPosts.push(...data.posts);
        nextPage = data.meta?.next_page;
      } while (nextPage);

      return allPosts.map(buildPostFromWordPress);
    })().catch((error) => {
      wordpressPostsPromise = null;
      console.error('Error fetching WordPress posts:', error);
      return [];
    });
  }

  return wordpressPostsPromise;
}

async function fetchWordPressPages(): Promise<WordPressPage[]> {
  if (!WORDPRESS_SITE) {
    return [];
  }

  if (!wordpressPagesPromise) {
    wordpressPagesPromise = (async () => {
      const allPages: WordPressPublicPage[] = [];
      let nextPage: string | undefined;

      do {
        const params = new URLSearchParams({
          type: 'page',
          number: '100',
          order_by: 'title',
          order: 'ASC',
          fields: 'ID,title,slug,content',
        });

        if (nextPage) {
          params.set('page_handle', nextPage);
        }

        const data = await requestWordPressCollection<WordPressPublicPage>('posts/', params);
        allPages.push(...data.posts);
        nextPage = data.meta?.next_page;
      } while (nextPage);

      return allPages.map(buildPageFromWordPress);
    })().catch((error) => {
      wordpressPagesPromise = null;
      console.error('Error fetching WordPress pages:', error);
      return [];
    });
  }

  return wordpressPagesPromise;
}

export async function getPosts(
  first: number = 10,
  after?: string
): Promise<{ posts: WordPressPost[]; hasNextPage: boolean; endCursor?: string }> {
  const allPosts = await fetchWordPressPosts();
  const startIndex = after ? Number(after) : 0;
  const posts = allPosts.slice(startIndex, startIndex + first);
  const endIndex = startIndex + posts.length;

  return {
    posts,
    hasNextPage: endIndex < allPosts.length,
    endCursor: endIndex < allPosts.length ? String(endIndex) : undefined,
  };
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const posts = await fetchWordPressPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await fetchWordPressPosts();
  return posts.map((post) => post.slug);
}

export async function getStaticPage(slug: string): Promise<WordPressPage | null> {
  const pages = await fetchWordPressPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function getAllStaticPageSlugs(): Promise<string[]> {
  const pages = await fetchWordPressPages();
  return pages.map((page) => page.slug);
}
