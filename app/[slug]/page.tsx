import { ogImagePath, DEFAULT_OG } from '@/lib/og';
import { getAllPostSlugs, getStaticPage, getAllStaticPageSlugs } from '@/lib/wordpress/client';
import '@/components/article/article.css';
import { loadPost, isLocalArticle } from '@/lib/content/posts';
import { listLocalArticles } from '@/lib/content/articles';
import { parsePortfolioHtml } from '@/lib/wordpress/parsePortfolio';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { ImageLightbox } from '@/components/ImageLightbox';
import { CodeBlockEnhancer } from '@/components/CodeBlockEnhancer';
import { publicPathForSlug, withTitleOverride, CLIENT_NAME_OVERRIDES, CLIENT_PAGE_DESCRIPTIONS } from '@/lib/content/client-pages';
import { NEW_MANYREQUESTS_ARTICLES, withCurrentManyRequestsSamples } from '@/lib/portfolio/manyrequests';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}


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
  const localSlugs = listLocalArticles().map((a) => a.slug);
  const postSlugs = await getAllPostSlugs();
  const staticPageSlugs = await getAllStaticPageSlugs();
  return [...new Set([...localSlugs, ...postSlugs, ...staticPageSlugs])].map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  // A local article first, then a WordPress post
  const post = await loadPost(slug);

  if (post) {
    const canva = isLocalArticle(post) ? ogImagePath(`article-${post.slug}`) : null;
    const images = canva ? [canva] : post.coverImage?.url ? [post.coverImage.url] : [DEFAULT_OG];
    return {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.brief,
      alternates: {
        canonical: `https://peaceakinwale.com/blog/${slug}`,
      },
      openGraph: {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.brief,
        images,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.brief,
        images,
      },
    };
  }

  // If not a post, try fetching as a static page
  const staticPage = withTitleOverride(slug, await getStaticPage(slug));

  if (staticPage) {
    // Own share tags, so a shared client page doesn't inherit the homepage's
    // og:url and og:title from the layout (bug hunt, 8 Nov 2026).
    const url = `https://peaceakinwale.com${publicPathForSlug(slug)}`;
    const description = CLIENT_PAGE_DESCRIPTIONS[slug] ?? staticPage.title;
    return {
      title: staticPage.title,
      description,
      alternates: { canonical: url },
      openGraph: { title: staticPage.title, description, url, siteName: 'Peace Akinwale', locale: 'en_US', type: 'website', images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: staticPage.title }] },
      twitter: { card: 'summary_large_image', title: staticPage.title, description, images: [DEFAULT_OG] },
    };
  }

  return {
    title: 'Page not found',
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // A local article first, then a WordPress post
  const post = await loadPost(slug);
  if (post) permanentRedirect(`/blog/${slug}`);
  let isStaticPage = false;
  let staticPage = null;

  // If not a post, try fetching as a static page
  if (!post) {
    staticPage = withTitleOverride(slug, await getStaticPage(slug));
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
      const pageUrl = `https://peaceakinwale.com${publicPathForSlug(slug)}`;
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
                  href="/case-studies"
                  className="text-sm uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors"
                >
                  Case studies
                </Link>
              </div>

              <h1 className="mb-6">
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
    const parsedRaw = withCurrentManyRequestsSamples(
      parsePortfolioHtml(staticPage.content.html, staticPage.title),
      slug === 'b2b-content-for-manyrequests' ? NEW_MANYREQUESTS_ARTICLES : [],
    );
    const nameOverride = CLIENT_NAME_OVERRIDES[slug];
    const parsed = nameOverride
      ? { ...parsedRaw, sections: parsedRaw.sections.map((sec) => ({ ...sec, clientName: nameOverride })) }
      : parsedRaw;
    const hasPortfolioContent = parsed.sections.some(s => s.projects.length > 0);

    if (hasPortfolioContent) {
      const ogImages = await fetchOgImagesForPortfolio(parsed);
      return (
        <>
          <PortfolioGrid parsed={parsed} pageTitle={staticPage.title} ogImages={ogImages} />
          <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
            <Link
              href="/writing"
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
            <h1 className="mb-6">
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

  notFound();
}
