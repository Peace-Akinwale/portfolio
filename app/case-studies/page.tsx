import Link from 'next/link';
import type { Metadata } from 'next';
import { getFaviconUrl } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'Case Studies | Peace Akinwale',
  description:
    'Deep-dives into B2B SaaS content engagements — what I was hired to do, how I approached it, and what the work produced.',
  alternates: {
    canonical: 'https://peaceakinwale.com/case-studies',
  },
};

const CASE_STUDIES = [
  {
    client: 'ManyRequests',
    domain: 'manyrequests.com',
    category: 'B2B SaaS · Client portal software',
    headline: '43 product-led articles, including page-1 rankings against Workfront and the design crowd',
    summary:
      'ManyRequests hired me to write articles where the product shows up inside the piece — in the comparisons, in the how-to steps, in the screenshots, in real customer stories. Over 20 months I wrote 43 of them.',
    stats: [
      { value: '43', label: 'Articles published · 88% BOFU' },
      { value: '#6', label: 'Google for "Workfront alternatives"' },
      { value: '20mo', label: 'Active retainer' },
    ],
    href: '/case-studies/manyrequests',
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
          <div className="max-w-3xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] mb-5"
              style={{ color: 'var(--accent)' }}
            >
              Case Studies
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 text-foreground"
              style={{ letterSpacing: '-0.03em' }}
            >
              Client work, broken down
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl">
              What I was hired to do, how I approached it, and what the work produced. Numbers where I have them.
            </p>
          </div>
        </div>
      </section>

      {/* ── Case study cards ───────────────────────────── */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="flex flex-col gap-6 max-w-4xl">
            {CASE_STUDIES.map((cs) => (
              <Link
                key={cs.href}
                href={cs.href}
                className="group rounded-xl border border-border p-8 sm:p-10 transition-all hover:border-accent/40 hover:shadow-md"
                style={{ background: 'var(--background)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getFaviconUrl(cs.domain, 32)}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded"
                    loading="lazy"
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {cs.client} &middot; {cs.category}
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-extrabold text-foreground mb-4 leading-[1.2] group-hover:text-accent transition-colors"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {cs.headline}
                </h2>
                <p className="text-[14px] leading-[1.8] text-muted-foreground mb-8 max-w-2xl">
                  {cs.summary}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  {cs.stats.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border px-4 py-3"
                      style={{ background: 'var(--muted)' }}
                    >
                      <p
                        className="text-xl font-extrabold mb-0.5"
                        style={{ letterSpacing: '-0.02em', color: 'var(--accent)' }}
                      >
                        {s.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                <span
                  className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4 transition-opacity group-hover:opacity-70"
                  style={{ color: 'var(--accent)' }}
                >
                  Read the full breakdown &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
