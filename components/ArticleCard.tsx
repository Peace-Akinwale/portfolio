import Link from 'next/link';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import type { HashnodePost } from '@/lib/hashnode/types';

// One row of the blog index and of "related" lists: date on the left, title in
// Sprat, the standfirst in Newsreader, the first tag and read time beneath.
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
        {post.tags && post.tags.length > 0 && <p className="tagline">{post.tags.map((t) => t.name).join(' · ')}</p>}
      </div>
    </li>
  );
}
