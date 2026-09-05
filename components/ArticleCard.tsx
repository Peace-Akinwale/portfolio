import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import type { HashnodePost } from '@/lib/hashnode/types';
import { cx } from '@/lib/cx';

/**
 * One article in an index: small cover, tag, title, brief, date and read time.
 * Renders as a list item; wrap in <ol> or <ul>.
 */
export function ArticleCard({ post, className }: { post: HashnodePost; className?: string }) {
  const href = `/${post.slug}`;
  return (
    <li className={cx('group grid gap-x-8 gap-y-4 border-t border-border py-7 sm:grid-cols-[minmax(0,1fr)_11rem] sm:py-8', className)}>
      <div className="min-w-0">
        {post.tags?.[0] && (
          <p className="t-label mb-3 text-muted-foreground">
            <Link href={`/tag/${post.tags[0].slug}`} className="hover:text-foreground">
              {post.tags[0].name}
            </Link>
          </p>
        )}
        <h3 className="t-h3 text-foreground">
          <Link href={href} className="group-hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 max-w-prose text-[15px] leading-relaxed text-muted-foreground">{post.brief}</p>
        <p className="tabular mt-4 text-sm text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>, {formatReadingTime(post.readTimeInMinutes)}
        </p>
      </div>
      {post.coverImage?.url && (
        <Link href={href} className="order-first sm:order-none" aria-hidden tabIndex={-1}>
          <span className="relative block aspect-[16/10] overflow-hidden rounded-sm bg-muted">
            <Image src={post.coverImage.url} alt="" fill sizes="(min-width: 640px) 11rem, 100vw" className="object-cover" />
          </span>
        </Link>
      )}
    </li>
  );
}

export function ArticleList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ol className={cx('border-b border-border', className)}>{children}</ol>;
}
