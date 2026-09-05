import Image from 'next/image';
import Link from 'next/link';
import { AVAILABILITY, CALENDLY_URL } from '@/lib/content/clients';
import { Chapter } from './Chapter';

const link = 'text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent';

/** Chapter 6. The smallest type on the page. The ask, set as running text. */
export function Colophon() {
  return (
    <Chapter number="06" title="Colophon" id="colophon">
      <div className="flex max-w-[62ch] flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <Image
          src="/images/peace-akinwale-hero.jpg"
          alt="Peace Akinwale"
          width={96}
          height={120}
          className="h-[7.5rem] w-24 shrink-0 rounded-sm object-cover object-top"
          sizes="96px"
        />
        <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Peace Akinwale</span> writes product-led content for B2B SaaS
            companies from Lagos, Nigeria. Heads of content, founders, and agency owners hire him for comparison pages,
            alternatives pages, workflow guides, and refreshes of the articles that used to rank.
          </p>
          <p>
            {AVAILABILITY}.{' '}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={link}>
              Book a 30-minute call
            </a>
            , or{' '}
            <Link href="/contact" className={link}>
              write to me
            </Link>
            . Pricing is on the{' '}
            <Link href="/services" className={link}>
              services page
            </Link>
            , no call required.
          </p>
          <p className="text-sm">
            Set in Syne and DM Sans. Built with Next.js and no animation library. Type-only above the fold, on purpose.
          </p>
        </div>
      </div>
    </Chapter>
  );
}
