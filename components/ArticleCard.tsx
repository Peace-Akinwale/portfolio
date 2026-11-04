import Link from 'next/link';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import type { HashnodePost } from '@/lib/hashnode/types';

// One row of the blog index and of "related" lists: publication date and read
// time on the left, title in Fraunces, the standfirst in DM Sans. Topic tags were
// removed (Peace, 4 Nov 2026: they weren't links and added nothing).
export function ArticleCard({ post, heading = 'h2' }: { post: HashnodePost; heading?: 'h2' | 'h3' }) {
  const H = heading;
  return (
    <li className="post-row">
      <div className="when">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'd MMM yyyy')}</time>
        <small>{formatReadingTime(post.readTimeInMinutes)}</small>
      </div>
      <div>
        <H><Link href={`/${post.slug}`}>{post.title}</Link></H>
        {post.brief && <p>{post.brief}</p>}
      </div>
    </li>
  );
}
