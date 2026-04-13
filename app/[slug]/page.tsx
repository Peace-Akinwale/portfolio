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
  let post = await getPostBySlug(slug);

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
  let post = await getPostBySlug(slug);
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

          <article className="max-w-4xl mx-auto px-6 py-16">
            <header className="mb-12">
              <div className="mb-4">
                <Link
                  href="/projects"
                  className="text-sm uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors"
                >
                  Projects
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {staticPage.title}
              </h1>

              <div className="flex items-center gap-4 text-muted-foreground mb-8">
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded-sm">
                  {readTime} min read
                </span>
              </div>

              {coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted mb-12">
                  <Image
                    src={coverImage}
                    alt={staticPage.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </header>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedStaticHtml }}
            />

            <footer className="mt-16 pt-8 border-t border-border">
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  Share
                </h3>
                <ShareButtons url={pageUrl} title={staticPage.title} />
              </div>
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
          <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
            <Link
              href="/portfolio"
              className="inline-block text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
            >
              ← Back to Portfolio
            </Link>
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

        <article className="max-w-4xl mx-auto px-6 py-16">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {staticPage.title}
            </h1>
          </header>

          {/* Static Page Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: staticPage.content.html }}
          />

          {/* Back to Blog */}
          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="inline-block text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
            >
              ← Back to Blog
            </Link>
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

  return (
    <>
      <ReadingProgress />
      <TableOfContents />
      <ImageLightbox />
      <CodeBlockEnhancer />

      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Article Header */}
        <header className="mb-12">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">
              {post.tags[0].name}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            By {post.author.name}
          </Link>
          <span>•</span>
          <time dateTime={post.publishedAt} className="text-sm">
            {formatDate(post.publishedAt, 'MMMM dd, yyyy')}
          </time>
          <span>•</span>
          <span className="text-sm font-medium px-3 py-1 bg-muted rounded-sm">
            {formatReadingTime(post.readTimeInMinutes)}
          </span>
        </div>

        {/* Cover Image */}
        {post.coverImage?.url && (
          <div className="relative aspect-[16/9] overflow-hidden bg-muted mb-12">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedPostHtml }}
      />

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-muted text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Share
          </h3>
          <ShareButtons url={post.url} title={post.title} />
        </div>

        <ArticleEndCta />
      </footer>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-border">
          <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <ArticleCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="mt-16 text-center">
        <Link
          href="/blog"
          className="inline-block text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
      <Comments postSlug={post.slug} postTitle={post.title} />
      </article>
    </>
  );
}
