import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import type { HashnodePost } from '@/lib/hashnode/types';

interface ArticleCardProps {
  post: HashnodePost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group border-t border-border pt-6 hover:border-accent transition-all duration-300">
      {/* Cover Image */}
      {post.coverImage?.url && (
        <Link href={`/${post.slug}`} className="block mb-4">
          <div className="relative aspect-[16/10] overflow-hidden bg-muted rounded-sm">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {post.tags[0].name}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="font-sans text-xl md:text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
        <Link href={`/${post.slug}`}>{post.title}</Link>
      </h3>

      {/* Excerpt */}
      <p className="text-muted-foreground mb-4 line-clamp-3">
        {post.brief}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <time dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
        <span>•</span>
        <span>{formatReadingTime(post.readTimeInMinutes)}</span>
      </div>
    </article>
  );
}
