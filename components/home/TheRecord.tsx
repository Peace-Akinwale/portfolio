import { Button, IndexList, IndexRow, Reveal } from '@/components/ui';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import type { HashnodePost } from '@/lib/hashnode/types';
import { Chapter } from './Chapter';

const WORK = [
  {
    number: '01',
    title: 'ManyRequests',
    href: '/case-studies/manyrequests',
    meta: '44 product-led articles on a 20-month retainer. Page one for "Workfront alternatives" and "design annotation tools".',
    aside: 'Case study',
  },
  {
    number: '02',
    title: 'HigherVisibility',
    href: '/portfolio',
    meta: '233% organic traffic growth from long-tail, semantically related keyword work on the agency blog.',
    aside: 'Portfolio',
  },
  {
    number: '03',
    title: 'Marker.io',
    href: '/b2b-content-for-marker.io',
    meta: 'Ghostwritten QA testing guides. One round of feedback per article, then none.',
    aside: 'Samples',
  },
  {
    number: '04',
    title: 'Jabra',
    href: '/portfolio',
    meta: 'Ghostwritten workplace and meeting-room guides through Spicy Margarita.',
    aside: 'Portfolio',
  },
];

/** Chapter 3. The work as an index. Real figures only. */
export function TheRecord({ posts }: { posts: HashnodePost[] }) {
  return (
    <Chapter number="03" title="The record" id="the-record">
      <Reveal>
        <h2 className="t-h1 max-w-[18ch] text-foreground">What the method produced.</h2>
      </Reveal>

      <Reveal className="mt-12">
        <IndexList>
          {WORK.map((w) => (
            <IndexRow key={w.number} number={w.number} title={w.title} href={w.href} meta={w.meta} aside={w.aside} />
          ))}
        </IndexList>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <Button variant="text" href="/case-studies">
            All case studies
          </Button>
          <Button variant="text" href="/portfolio">
            Full portfolio
          </Button>
        </div>
      </Reveal>

      {posts.length > 0 && (
        <Reveal className="mt-20">
          <p className="t-label mb-6 text-muted-foreground">Recent writing</p>
          <IndexList>
            {posts.map((post) => (
              <IndexRow
                key={post.id}
                title={post.title}
                href={`/${post.slug}`}
                meta={`${formatDate(post.publishedAt)}, ${formatReadingTime(post.readTimeInMinutes)}`}
                aside={post.tags?.[0]?.name}
              />
            ))}
          </IndexList>
          <div className="mt-6">
            <Button variant="text" href="/blog">
              Everything I have published
            </Button>
          </div>
        </Reveal>
      )}
    </Chapter>
  );
}
