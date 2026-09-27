import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AVAILABILITY } from '@/lib/site';
import { MANYREQUESTS_ARTICLE_COUNT } from '@/lib/portfolio/manyrequests';

export const metadata: Metadata = {
  title: 'B2B SaaS Content Writer | Peace Akinwale',
  description:
    'B2B SaaS content writer for product-led software companies. I write articles that rank, refresh content with business potential, and help brands show up in AI search.',
  keywords: [
    'B2B SaaS content writer',
    'product-led content writer',
    'B2B content writer',
    'SaaS content writer',
  ],
  alternates: {
    canonical: 'https://peaceakinwale.com',
  },
};

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://peaceakinwale.com/#home',
  url: 'https://peaceakinwale.com',
  name: 'Peace Akinwale | B2B SaaS Content Writer',
  description:
    'Homepage for Peace Akinwale, a B2B SaaS content writer who specializes in product-led content, content refreshes, and AI-search-friendly articles.',
  about: {
    '@type': 'Person',
    name: 'Peace Akinwale',
    jobTitle: 'B2B SaaS content writer',
  },
  mainEntity: {
    '@type': 'Service',
    name: 'B2B SaaS content writing',
    provider: {
      '@type': 'Person',
      name: 'Peace Akinwale',
    },
    serviceType: 'B2B SaaS content writer',
  },
};

// Published pieces, linked to where they live. Rankings come from the ManyRequests case study (April 2026).
const RECENT_WORK = [
  {
    title: 'We Evaluated 6 Best Workfront Alternatives for Creative Agencies in 2026',
    client: 'ManyRequests',
    link: 'https://www.manyrequests.com/blog/workfront-alternatives',
    note: 'Ranked #6 on Google for “Workfront alternatives”',
  },
  {
    title: 'Agency Retainer Model: How to Price, Package, and Scale',
    client: 'ManyRequests',
    link: 'https://www.manyrequests.com/blog/agency-retainer-model',
  },
  {
    title: 'What is Regression Testing? A Practical Guide',
    client: 'Marker.io, ghostwritten',
    link: 'https://marker.io/blog/regression-testing',
  },
  {
    title: '7 Modern Meeting Room Designs & What You Need to Nail Them',
    client: 'Jabra, ghostwritten',
    link: 'https://www.jabra.com/discover/modern-meeting-room',
  },
  {
    title: 'Why Being Invisible in Answer Engines Is a Real Business Problem',
    client: 'HigherVisibility',
    link: 'https://www.highervisibility.com/why-being-invisible-in-answer-engines-is-a-real-business-problem/',
  },
  {
    title: '10 Best Design Annotation Tools for Agencies in 2026 + Best Use Cases',
    client: 'ManyRequests',
    link: 'https://www.manyrequests.com/blog/design-annotation-software',
    note: 'Ranked #6 on Google for “design annotation tools”',
  },
];

const PRICES = [
  { offer: 'Refresh an existing article', price: '$400', detail: '2,000–2,500 words' },
  { offer: 'Write a new article', price: '$600', detail: '2,000–3,000 words' },
  { offer: 'Five articles a month', price: '$2,700', detail: 'the monthly retainer, 10% off the single-article price' },
];

const primaryButton =
  'inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90';

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-8 text-foreground"
              style={{ letterSpacing: '-0.035em', textWrap: 'balance' }}
            >
              <span className="whitespace-nowrap">Product-led</span> content for B2B&nbsp;SaaS
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground mb-10 max-w-xl">
              I&rsquo;m Peace Akinwale, a content writer in Lagos. I write articles where your product shows up because it
              solves the reader&rsquo;s problem, not because a brief said &ldquo;mention it somewhere.&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/contact"
                className={primaryButton}
                style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
              >
                Book a call
              </Link>
              <a
                href="#work"
                className="text-sm font-semibold text-foreground underline underline-offset-4 decoration-accent/40 hover:decoration-accent py-2"
              >
                Read recent work
              </a>
            </div>
            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden />
              {AVAILABILITY}
            </p>
          </div>

          <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <Image
              src="/images/Peace Akinwale portrait.jpg"
              alt="Peace Akinwale"
              fill
              priority
              sizes="300px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Recent work: the page's one loud element */}
      <section id="work" className="border-t border-border scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
            Recent work
          </h2>
          <p className="text-base text-muted-foreground mb-10 max-w-xl">
            A few published pieces. Each opens on the client&rsquo;s site.
          </p>

          <ol className="border-b border-border">
            {RECENT_WORK.map((piece) => (
              <li key={piece.link} className="border-t border-border">
                <a
                  href={piece.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-2 py-5 sm:py-6 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-10"
                >
                  <span
                    className="text-xl sm:text-2xl md:text-[1.7rem] font-bold leading-snug text-foreground group-hover:text-accent transition-colors"
                    style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.015em', textWrap: 'balance' }}
                  >
                    {piece.title}
                    <span className="ml-2 text-base align-middle text-muted-foreground group-hover:text-accent" aria-hidden>
                      ↗
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="text-sm text-muted-foreground md:pt-2">
                    {piece.client}
                    {piece.note && <span className="block mt-1 text-foreground">{piece.note}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-8 text-sm font-semibold">
            <Link href="/portfolio" className="text-foreground underline underline-offset-4 decoration-accent/40 hover:decoration-accent">
              All writing samples
            </Link>
            <Link
              href="/case-studies/manyrequests"
              className="text-foreground underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
            >
              How I wrote {MANYREQUESTS_ARTICLE_COUNT} articles for ManyRequests
            </Link>
          </div>
        </div>
      </section>

      {/* Proof: an editor's own words, unedited */}
      <section className="border-t border-border bg-muted">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 grid gap-10 md:grid-cols-[335px_minmax(0,1fr)] md:items-center">
          <Image
            src="/images/testimonials/melissa-malec-jabra.png"
            alt="Google Docs comment from Melissa Malec: “you had me hooked from start to finish! It was a really well researched, well structured, helpful piece of content with appropriate product placements.”"
            width={335}
            height={469}
            className="rounded-xl border border-border w-full max-w-[335px]"
          />
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>
              What an editor wrote on my first draft
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-6">
              Melissa Malec, content lead at Jabra (through Spicy Margarita), left this comment on a piece about hybrid work
              schedules on 29 May 2025. It&rsquo;s a screenshot of the doc, not a quote I tidied up.
            </p>
            <Link
              href="/testimonials"
              className="text-sm font-semibold text-foreground underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
            >
              More from clients and editors
            </Link>
          </div>
        </div>
      </section>

      {/* Prices and the next step */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 grid gap-14 md:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8" style={{ letterSpacing: '-0.02em' }}>
              What it costs
            </h2>
            <ul className="space-y-4 mb-8">
              {PRICES.map((item) => (
                <li key={item.offer} className="text-base text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {item.offer}: {item.price}
                  </span>{' '}
                  ({item.detail})
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="text-sm font-semibold text-foreground underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
            >
              What each one includes
            </Link>
          </div>

          <div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-foreground mb-5"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Tell me what you&rsquo;re publishing next
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-8">
              Book a 30-minute call, or email{' '}
              <a
                href="mailto:akindayopeaceakinwale@gmail.com"
                className="text-foreground underline underline-offset-4 decoration-accent/40 hover:decoration-accent break-all sm:break-normal"
              >
                akindayopeaceakinwale@gmail.com
              </a>{' '}
              if you&rsquo;d rather write first.
            </p>
            <Link
              href="/contact"
              className={primaryButton}
              style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
            >
              Book a call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
