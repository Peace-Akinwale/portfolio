import { ogImagePath, DEFAULT_OG } from '@/lib/og';
import { getAllPostSlugs, getStaticPage, getAllStaticPageSlugs } from '@/lib/hashnode/client';
import '@/components/article/article.css';
import { loadPost, loadAllPosts, isLocalArticle, relatedTo } from '@/lib/content/posts';
import { listLocalArticles } from '@/lib/content/articles';
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
        canonical: `https://peaceakinwale.com/${slug}`,
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
    title: 'Page not found | Peace Akinwale',
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // A local article first, then a WordPress post
  const post = await loadPost(slug);
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
    const parsed = withCurrentManyRequestsSamples(
      parsePortfolioHtml(staticPage.content.html, staticPage.title),
      slug === 'b2b-content-for-manyrequests' ? NEW_MANYREQUESTS_ARTICLES : [],
    );
    const hasPortfolioContent = parsed.sections.some(s => s.projects.length > 0);

    if (hasPortfolioContent) {
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

  // Render the article (a local one or a WordPress post)
  if (!post) {
    notFound();
  }

  const { posts: allPosts } = await loadAllPosts();
  const relatedPosts = relatedTo(post, allPosts);
  const local = isLocalArticle(post);
  const renderedPostHtml = local ? post.content.html : stripLeadingDuplicateCoverImage(post.content.html, post.coverImage?.url);
  const showReview = local && post.review && process.env.NODE_ENV !== 'production';

  return (
    <div className="reading-light">
      <ReadingProgress />
      <TableOfContents />
      <ImageLightbox />
      <CodeBlockEnhancer />

      <article className="article gutter">
        <header className="article-head">
          <p className="kicker">
            <Link href="/blog">Blog</Link>
            {post.tags && post.tags.length > 0 && <> · {post.tags[0].name}</>}
          </p>
          <h1>{post.title}</h1>
          {post.brief && <p className="standfirst">{post.brief}</p>}
          <p className="meta">
            <span>By <Link href="/about" className="underline underline-offset-4 hover:text-accent" rel="author">{post.author.name}</Link></span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'd MMMM yyyy')}</time>
            <span>{formatReadingTime(post.readTimeInMinutes)}</span>
          </p>
          {post.coverImage?.url && (
            <figure className="article-cover">
              <Image src={post.coverImage.url} alt="" width={1200} height={675} sizes="(max-width: 960px) 100vw, 896px" priority />
            </figure>
          )}
        </header>

        <div className="article-layout">
          <div>
            {showReview && <p className="review-note"><b>Review note (not shown in production):</b> {post.review}</p>}
            <div className="prose" dangerouslySetInnerHTML={{ __html: renderedPostHtml }} />

            <footer className="article-foot">
              {post.tags && post.tags.length > 0 && (
                <>
                  <h2>Tagged</h2>
                  <ul className="article-tags">
                    {post.tags.map((tag) => (
                      <li key={tag.id}>{local ? <span>{tag.name}</span> : <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>}</li>
                    ))}
                  </ul>
                </>
              )}
              <h2>Share</h2>
              <ShareButtons url={post.url} title={post.title} />
              <ArticleEndCta />
            </footer>
          </div>
          <div aria-hidden="true" />
        </div>

        {relatedPosts.length > 0 && (
          <section className="related" aria-labelledby="related-h">
            <h2 id="related-h">Also on the blog</h2>
            <ul className="posts">
              {relatedPosts.map((relatedPost) => (
                <ArticleCard key={relatedPost.id} post={relatedPost} heading="h3" />
              ))}
            </ul>
          </section>
        )}

        <Comments postSlug={post.slug} postTitle={post.title} />
      </article>
    </div>
  );
}
