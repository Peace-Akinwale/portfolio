import { ogImagePath, DEFAULT_OG } from '@/lib/og';
import { JsonLdScript } from '@/components/JsonLdScript';
import { articleJsonLd, breadcrumbList } from '@/lib/seo/jsonld';
import { getAllPostSlugs } from '@/lib/wordpress/client';
import '@/components/article/article.css';
import { loadPost, loadAllPosts, isLocalArticle, relatedTo } from '@/lib/content/posts';
import { listLocalArticles } from '@/lib/content/articles';
import { formatDate, formatReadingTime } from '@/lib/wordpress/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArticleCard } from '@/components/ArticleCard';
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

// Posts whose body repeats the cover image under a different file name, so the
// stem comparison above cannot catch it (review, 29 Oct 2026). slug -> the body
// copy's file stem.
const DUPLICATE_COVER: Record<string, string> = { 'how-to-optimize-for-aeo': 'image-6' };
function stripImageByStem(html: string, stem: string): string {
  const img = new RegExp(`(?:<figure\\b[^>]*>\\s*)?<img\\b[^>]*src=["'][^"']*\\/${stem}\\.[a-z0-9]+(?:\\?[^"']*)?["'][^>]*>\\s*(?:<figcaption[^>]*>.*?<\\/figcaption>\\s*)?(?:<\\/figure>)?`, 'is');
  return html.replace(img, '');
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const localSlugs = listLocalArticles().map((a) => a.slug);
  const postSlugs = await getAllPostSlugs();
  return [...new Set([...localSlugs, ...postSlugs])].map((slug) => ({ slug }));
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
        url: `https://peaceakinwale.com/blog/${slug}`,
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

  return { title: 'Page not found' };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);
  // Render the article (a local one or a WordPress post)
  if (!post) {
    notFound();
  }

  const { posts: allPosts } = await loadAllPosts();
  const relatedPosts = relatedTo(post, allPosts);
  const local = isLocalArticle(post);
  const renderedPostHtml = local
    ? post.content.html
    : DUPLICATE_COVER[post.slug]
      ? stripImageByStem(post.content.html, DUPLICATE_COVER[post.slug])
      : stripLeadingDuplicateCoverImage(post.content.html, post.coverImage?.url);
  const showReview = local && post.review && process.env.NODE_ENV !== 'production';

  const articleLd = articleJsonLd({
    title: post.title,
    description: post.brief || post.title,
    url: `/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: post.coverImage?.url,
  });

  return (
    <div className="reading-light">
      <JsonLdScript data={[articleLd, breadcrumbList([{ name: 'Blog', url: '/blog' }, { name: post.title, url: `/blog/${post.slug}` }])]} />
      <ReadingProgress />
      <TableOfContents />
      <ImageLightbox />
      <CodeBlockEnhancer />

      <article className="article gutter">
        <header className="article-head">
          <p className="kicker">
            <Link href="/blog">Blog</Link>
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
                  <h2>Filed under</h2>
                  <ul className="article-tags">
                    {post.tags.map((tag) => (
                      <li key={tag.id}>{local ? <span>{tag.name}</span> : <Link href={`/tag/${tag.slug}`}>{tag.name}</Link>}</li>
                    ))}
                  </ul>
                </>
              )}
              <h2>Know someone who’d like this?</h2>
              <ShareButtons url={post.url} title={post.title} />
              <ArticleEndCta />
            </footer>
          </div>
          <div aria-hidden="true" />
        </div>

        {relatedPosts.length > 0 && (
          <section className="related" aria-labelledby="related-h">
            <h2 id="related-h">Read this next</h2>
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
