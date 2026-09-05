import { getPostBySlug, getAllPostSlugs, getStaticPage, getAllStaticPageSlugs, getPosts } from '@/lib/hashnode/client';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArticleCard } from '@/components/ArticleCard';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { ImageLightbox } from '@/components/ImageLightbox';
import { CodeBlockEnhancer } from '@/components/CodeBlockEnhancer';
import { ArticleEndCta } from '@/components/ArticleEndCta';
import { Comments } from '@/components/Comments';
import { ArticleList } from '@/components/ArticleCard';
import { Button } from '@/components/ui';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const NEW_MANYREQUESTS_ARTICLES = [
  {
    title: 'Wrike vs ClickUp: Which Tool Is Better for Agencies?',
    link: 'https://www.manyrequests.com/blog/wrike-vs-clickup',
  },
  {
    title: 'Agency Retainer Model: How to Price, Package, and Scale',
    link: 'https://www.manyrequests.com/blog/agency-retainer-model',
  },
  {
    title: '6 Best Project Management Software for Designers in 2026',
    link: 'https://www.manyrequests.com/blog/project-management-software-for-designers',
  },
];

function getAssetName(url: string): string {
  try {
    const pathname = url.startsWith('/') ? url : new URL(url).pathname;
    const cleaned = pathname.split('?')[0].split('#')[0];
    return cleaned.split('/').filter(Boolean).pop()?.toLowerCase() ?? '';
  } catch {
    return url.split('?')[0].split('#')[0].split('/').filter(Boolean).pop()?.toLowerCase() ?? '';
  }
}

function getComparableAssetStem(url: string): string {
  const assetName = getAssetName(url);
  if (!assetName) {
    return '';
  }

  return assetName
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/-\d+x\d+$/i, '')
    .replace(/-\d+$/i, '');
}

function stripLeadingDuplicateCoverImage(html: string, coverUrl?: string): string {
  if (!coverUrl) {
    return html;
  }

  const coverAsset = getComparableAssetStem(coverUrl);
  if (!coverAsset) {
    return html;
  }

  const leadingFigurePattern =
    /^\s*(?:<figure\b[^>]*>\s*)?<img\b[^>]*src=["']([^"']+)["'][^>]*>\s*(?:<\/figure>)?\s*/i;
  const leadingParagraphFigurePattern =
    /^\s*<p>\s*(?:<figure\b[^>]*>\s*)?<img\b[^>]*src=["']([^"']+)["'][^>]*>\s*(?:<\/figure>)?\s*<\/p>\s*/i;

  const candidates = [leadingParagraphFigurePattern, leadingFigurePattern];

  for (const pattern of candidates) {
    const match = html.match(pattern);
    if (!match?.[1]) {
      continue;
    }

    const firstAsset = getComparableAssetStem(match[1]);
    if (firstAsset && firstAsset === coverAsset) {
      return html.replace(pattern, '');
    }
  }

  return html;
}

// Allow dynamic generation for slugs not pre-rendered at build time
export const dynamicParams = true;

// Revalidate every hour
export const revalidate = 3600;

// Generate static paths for all articles and static pages
export async function generateStaticParams() {
  const postSlugs = await getAllPostSlugs();
  const staticPageSlugs = await getAllStaticPageSlugs();
  return [...postSlugs, ...staticPageSlugs].map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try fetching as a blog post first
  const post = await getPostBySlug(slug);

  if (post) {
    return {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.brief,
      alternates: {
        canonical: `https://peaceakinwale.com/${slug}`,
      },
      openGraph: {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.brief,
        images: post.coverImage?.url ? [post.coverImage.url] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.brief,
        images: post.coverImage?.url ? [post.coverImage.url] : [],
      },
    };
  }

  // If not a post, try fetching as a static page
  const staticPage = await getStaticPage(slug);

  if (staticPage) {
    return {
      title: staticPage.title,
      description: staticPage.title,
      alternates: {
        canonical: `https://peaceakinwale.com/${slug}`,
      },
    };
  }

  return {
    title: 'Page Not Found',
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Try fetching as a blog post first
  const post = await getPostBySlug(slug);
  let isStaticPage = false;
  let staticPage = null;

  // If not a post, try fetching as a static page
  if (!post) {
    staticPage = await getStaticPage(slug);
    isStaticPage = !!staticPage;
  }

  // If neither exists, show 404
  if (!post && !staticPage) {
    notFound();
  }

  // Slugs that should always render as plain articles, never as portfolio cards
  const articleOnlySlugs = new Set([
    'linkedin-router',
    'mylinks',
    'mystyleguide',
    'portfolio-project',
    'editorial-style-guide',
  ]);

  // Cover images for project sub-pages
  const projectCoverImages: Record<string, string> = {
    'linkedin-router': 'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772456192/LinkedIn_Router_dashboard_yeangn.png',
    'mylinks': 'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772457514/mylinks_app_demo_qbdfj7.png',
    'mystyleguide': 'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772458150/mystyleguide_uyokzm.png',
    'portfolio-project': '/images/blog/second-thorough-prompt.png',
    'editorial-style-guide': 'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772467301/claude_projext_vvozy6.png',
  };

  // Render static page if that's what we have
  if (isStaticPage && staticPage) {

    // Project sub-pages: full blog-post-style UI
    if (articleOnlySlugs.has(slug)) {
      const coverImage = projectCoverImages[slug];
      const wordCount = staticPage.content.html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
      const readTime = Math.max(1, Math.round(wordCount / 200));
      const pageUrl = `https://peaceakinwale.com/${slug}`;
      const renderedStaticHtml = stripLeadingDuplicateCoverImage(staticPage.content.html, coverImage);

      return (
        <>
          <ReadingProgress />
          <ImageLightbox />
          <CodeBlockEnhancer />

          <article className="mx-auto max-w-4xl gutter py-12 sm:py-16">
            <header className="reveal-group mb-12 max-w-[62ch]">
              <p className="t-label mb-6 text-muted-foreground" style={{ ['--i' as string]: 0 }}>
                <Link href="/projects" className="hover:text-foreground">
                  Projects
                </Link>
              </p>
              <h1 className="t-h1 text-foreground" style={{ ['--i' as string]: 1 }}>
                {staticPage.title}
              </h1>
              <p className="mt-6 text-sm text-muted-foreground" style={{ ['--i' as string]: 2 }}>
                {readTime} min read
              </p>
            </header>

            {coverImage && (
              <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-sm bg-muted">
                <Image src={coverImage} alt={staticPage.title} fill sizes="(min-width: 896px) 56rem, 100vw" className="object-cover" priority />
              </div>
            )}

            <div className="prose" dangerouslySetInnerHTML={{ __html: renderedStaticHtml }} />

            <footer className="mt-16 max-w-[65ch] border-t border-border pt-8">
              <ShareButtons url={pageUrl} title={staticPage.title} />
              <ArticleEndCta />
            </footer>
          </article>
        </>
      );
    }

    // Try parsing as portfolio-style content (lists of links)
    const parsed = parsePortfolioHtml(staticPage.content.html, staticPage.title);
    const hasPortfolioContent = parsed.sections.some(s => s.projects.length > 0);

    if (hasPortfolioContent) {
      if (slug === 'b2b-content-for-manyrequests' && parsed.sections.length > 0) {
        parsed.sections[0].projects.unshift(...NEW_MANYREQUESTS_ARTICLES);
      }
      const ogImages = await fetchOgImagesForPortfolio(parsed);
      return (
        <>
          <PortfolioGrid parsed={parsed} pageTitle={staticPage.title} ogImages={ogImages} />
          <div className="mx-auto max-w-6xl gutter pb-16">
            <Button variant="text" href="/portfolio">
              Back to the portfolio
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <ReadingProgress />
        <TableOfContents />
        <ImageLightbox />
        <CodeBlockEnhancer />

        <article className="mx-auto max-w-4xl gutter py-12 sm:py-16">
          <header className="mb-12 max-w-[62ch]">
            <h1 className="t-h1 text-foreground">{staticPage.title}</h1>
          </header>

          <div className="prose" dangerouslySetInnerHTML={{ __html: staticPage.content.html }} />

          <div className="mt-16">
            <Button variant="text" href="/blog">
              All articles
            </Button>
          </div>
        </article>
      </>
    );
  }

  // Render blog post
  if (!post) {
    notFound();
  }

  // Get related posts, preferring tag overlap and falling back to the latest posts.
  const { posts: allPosts } = await getPosts(20);
  const postTagSlugs = new Set(post.tags?.map((tag) => tag.slug.toLowerCase()) ?? []);
  const renderedPostHtml = stripLeadingDuplicateCoverImage(post.content.html, post.coverImage?.url);
  const relatedPosts = allPosts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const overlap =
        candidate.tags?.filter((tag) => postTagSlugs.has(tag.slug.toLowerCase())).length ?? 0;

      return {
        candidate,
        overlap,
        recency: new Date(candidate.publishedAt).getTime(),
      };
    })
    .sort((left, right) => {
      if (right.overlap !== left.overlap) {
        return right.overlap - left.overlap;
      }

      return right.recency - left.recency;
    })
    .slice(0, 3)
    .map((entry) => entry.candidate);

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.seo?.description || post.brief,
        image: post.coverImage?.url ? [post.coverImage.url] : undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { '@type': 'Person', name: post.author.name, url: 'https://peaceakinwale.com' },
        publisher: { '@type': 'Person', name: 'Peace Akinwale', url: 'https://peaceakinwale.com' },
        mainEntityOfPage: `https://peaceakinwale.com/${post.slug}`,
        keywords: post.tags?.map((t) => t.name).join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://peaceakinwale.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://peaceakinwale.com/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: `https://peaceakinwale.com/${post.slug}` },
        ],
      },
    ],
  };

  return (
    <div data-surface="paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <ReadingProgress />
      <TableOfContents />
      <ImageLightbox />
      <CodeBlockEnhancer />

      <article className="mx-auto max-w-4xl gutter py-12 sm:py-16">
        <header className="reveal-group mb-12 max-w-[62ch]">
          <p className="t-label mb-6 text-muted-foreground" style={{ ['--i' as string]: 0 }}>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            {post.tags?.[0] && (
              <>
                <span aria-hidden className="mx-2">
                  /
                </span>
                <Link href={`/tag/${post.tags[0].slug}`} className="hover:text-foreground">
                  {post.tags[0].name}
                </Link>
              </>
            )}
          </p>
          <h1 className="t-h1 text-foreground" style={{ ['--i' as string]: 1 }}>
            {post.title}
          </h1>
          <p className="mt-6 text-sm text-muted-foreground" style={{ ['--i' as string]: 2 }}>
            By {post.author.name}, <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'MMMM dd, yyyy')}</time>,{' '}
            {formatReadingTime(post.readTimeInMinutes)}
          </p>
        </header>

        {post.coverImage?.url && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-sm bg-muted">
            <Image src={post.coverImage.url} alt={post.title} fill sizes="(min-width: 896px) 56rem, 100vw" className="object-cover" priority />
          </div>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: renderedPostHtml }} />

        <footer className="mt-16 max-w-[65ch] border-t border-border pt-8">
          {post.tags && post.tags.length > 0 && (
            <ul className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag.id}>
                  <Link href={`/tag/${tag.slug}`} className="inline-block rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-foreground hover:text-foreground">
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <ShareButtons url={post.url} title={post.title} />
          <ArticleEndCta />
        </footer>

        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <h2 className="t-h3 mb-6 text-foreground">Related articles</h2>
            <ArticleList>
              {relatedPosts.map((relatedPost) => (
                <ArticleCard key={relatedPost.id} post={relatedPost} />
              ))}
            </ArticleList>
          </section>
        )}

        <div className="mt-12">
          <Button variant="text" href="/blog">
            All articles
          </Button>
        </div>
        <Comments postSlug={post.slug} postTitle={post.title} />
      </article>
    </div>
  );
}
