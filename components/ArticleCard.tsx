import Link from 'next/link';
import { formatReadingTime } from '@/lib/hashnode/utils';
import type { HashnodePost } from '@/lib/hashnode/types';

// One row of the blog index and of "related" lists: read time on the left, title
// in Fraunces, the standfirst in DM Sans, the first tag beneath. The date stays in
// the metadata only (Peace, 4 Nov 2026: no visible publication dates).
export function ArticleCard({ post, heading = 'h2' }: { post: HashnodePost; heading?: 'h2' | 'h3' }) {
  const H = heading;
  return (
    <li className="post-row">
      <div className="when">
        <span>{formatReadingTime(post.readTimeInMinutes)}</span>
      </div>
      <div>
        <H><Link href={`/${post.slug}`}>{post.title}</Link></H>
        {post.brief && <p>{post.brief}</p>}
        {post.tags && post.tags.length > 0 && <p className="tagline">{post.tags.map((t) => t.name).join(' · ')}</p>}
      </div>
    </li>
  );
}
