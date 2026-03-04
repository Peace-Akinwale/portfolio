import { getPostBySlug, getAllPostSlugs, getStaticPage, getAllStaticPageSlugs, getPosts } from '@/lib/hashnode/client';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArticleCard } from '@/components/ArticleCard';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { ImageLightbox } from '@/components/ImageLightbox';
import { CodeBlockEnhancer } from '@/components/CodeBlockEnhancer';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
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
    'portfolio-project': 'https://cdn.hashnode.com/res/hashnode/image/upload/v1771358819590/359f98d9-0ba4-4ca7-9486-8fd9223a85c1.png',
    'editorial-style-guide': 'https://cdn.hashnode.com/res/hashnode/image/upload/v1770062817824/f8071b8e-b17f-4efc-8d4b-b645c0ecb3b9.png',
  };

  // Render static page if that's what we have
  if (isStaticPage && staticPage) {

    // Project sub-pages: full blog-post-style UI
    if (articleOnlySlugs.has(slug)) {
      const coverImage = projectCoverImages[slug];
      const wordCount = staticPage.content.html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
      const readTime = Math.max(1, Math.round(wordCount / 200));
      const pageUrl = `https://peaceakinwale.com/${slug}`;

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

              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
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
              dangerouslySetInnerHTML={{ __html: staticPage.content.html }}
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
        parsed.sections[0].projects.unshift({
          title: '6 Best Project Management Software for Designers in 2026',
          link: 'https://www.manyrequests.com/blog/project-management-software-for-designers',
        });
      }
      return (
        <>
          <PortfolioGrid parsed={parsed} pageTitle={staticPage.title} />
          <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
            <Link
              href="/portfolio"
              className="inline-block font-sans text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
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
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
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
              className="inline-block font-sans text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
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

  // Get related posts (same tag, limit 3)
  const { posts: allPosts } = await getPosts(20);
  const relatedPosts = allPosts
    .filter((p) =>
      p.id !== post.id &&
      p.tags?.some((tag) => post.tags?.some((pt) => pt.id === tag.id))
    )
    .slice(0, 3);

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
        <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
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
        dangerouslySetInnerHTML={{ __html: post.content.html }}
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
      </footer>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-border">
          <h2 className="font-sans text-3xl font-bold mb-8">Related Articles</h2>
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
          className="inline-block font-sans text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
      </article>
    </>
  );
}
