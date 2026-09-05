import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container, Pill, Stat } from '@/components/ui';
import type { CaseStudy } from '@/lib/content/case-studies';

/**
 * The opening of a case study: breadcrumb, client line, title, byline, and
 * the real figures. Emits BreadcrumbList JSON-LD. Body sections follow.
 */
export function CaseStudyShell({
  study,
  date,
  readTime,
  children,
}: {
  study: CaseStudy;
  date: string;
  readTime: string;
  children: ReactNode;
}) {
  const url = `https://peaceakinwale.com/case-studies/${study.slug}`;
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://peaceakinwale.com' },
      { '@type': 'ListItem', position: 2, name: 'Case studies', item: 'https://peaceakinwale.com/case-studies' },
      { '@type': 'ListItem', position: 3, name: study.client, item: url },
    ],
  };
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.headline,
    description: study.summary,
    url,
    datePublished: date,
    author: { '@type': 'Person', name: 'Peace Akinwale', url: 'https://peaceakinwale.com' },
    about: { '@type': 'Organization', name: study.client, url: `https://${study.domain}` },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <Container width="narrow" className="pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="t-label flex items-center gap-2 text-muted-foreground">
          <Link href="/case-studies" className="hover:text-foreground">
            Case studies
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground">{study.client}</span>
        </nav>

        <header className="reveal-group mt-10 max-w-[62ch]">
          <p className="t-label text-accent" style={{ ['--i' as string]: 0 }}>
            {study.client}, {study.category}
          </p>
          <h1 className="t-h1 mt-6 text-foreground" style={{ ['--i' as string]: 1 }}>
            {study.headline}
          </h1>
          <p className="mt-6 text-sm text-muted-foreground" style={{ ['--i' as string]: 2 }}>
            By Peace Akinwale, {date}, {readTime}
            {!study.published && (
              <>
                {' '}
                <Pill dot={false} className="ml-2">
                  Draft, in review, not linked
                </Pill>
              </>
            )}
          </p>
        </header>

        {study.stats.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-8 border-y border-border py-8 sm:grid-cols-4">
            {study.stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </dl>
        )}
      </Container>

      {children}
    </article>
  );
}

/** A body section of a case study: label, heading, prose-width content. */
export function CaseSection({
  label,
  title,
  children,
  wide = false,
}: {
  label?: string;
  title?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="border-t border-border py-12 sm:py-16">
      <Container width={wide ? 'narrow' : 'prose'}>
        {label && <p className="t-label mb-5 text-muted-foreground">{label}</p>}
        {title && <h2 className="t-h2 mb-8 text-foreground">{title}</h2>}
        <div className="flex flex-col gap-5 text-[17px] leading-[1.8] text-muted-foreground [&_strong]:text-foreground">{children}</div>
      </Container>
    </section>
  );
}

export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-sm border border-border" loading="lazy" />
      {caption && <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export const linkClass = 'text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent';
