import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/components/case-study/case-study.css';
import { getCaseStudy, listCaseStudies } from '@/lib/content/case-studies';
import { dayLabel } from '@/lib/content/dates';
import { SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return listCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: `${SITE_URL}/case-studies/${cs.slug}` },
    openGraph: { title: cs.title, description: cs.summary, url: `${SITE_URL}/case-studies/${cs.slug}`, type: 'article', images: cs.cover ? [cs.cover.src] : undefined },
  };
}

function Href({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith('/')) return <Link href={href}>{children}</Link>;
  return <a href={href} rel="noopener" target="_blank">{children}</a>;
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const all = listCaseStudies();
  const related = cs.related.map((r) => all.find((c) => c.slug === r)).filter((c): c is NonNullable<typeof c> => !!c);
  const next = related.length ? related : all.filter((c) => c.slug !== cs.slug).slice(0, 2);

  return (
    <div className="gutter mx-auto max-w-[1180px]">
      <p className="pt-6 text-[14px]">
        <Link href="/portfolio" className="underline underline-offset-4 hover:text-accent">The record</Link>
        <span className="text-muted-foreground"> / </span>
        <Link href="/case-studies" className="underline underline-offset-4 hover:text-accent">Case studies</Link>
      </p>
      <header className="cs-head">
        <div>
          <p className="eyebrow"><b>{cs.kind === 'built' ? 'Built' : 'Wrote'}</b> {[cs.for, cs.status].filter(Boolean).join(', ')}</p>
          <h1>{cs.title}</h1>
          <p className="summary">{cs.summary}</p>
        </div>
        <dl className="cs-facts">
          <div><dt>When</dt><dd><time dateTime={cs.date}>{dayLabel(cs.date)}</time></dd></div>
          {cs.for && <div><dt>For</dt><dd>{cs.for}</dd></div>}
          <div><dt>Where it stands</dt><dd>{cs.status}</dd></div>
          {cs.links.map((l) => (
            <div key={l.href}><dt>Link</dt><dd><Href href={l.href}>{l.label}</Href></dd></div>
          ))}
          <div><dt>Reading time</dt><dd>{cs.readingMinutes} min</dd></div>
        </dl>
      </header>

      <div className="cs-body">
        <article className="prose" dangerouslySetInnerHTML={{ __html: cs.html }} />
        <aside className="cs-aside" aria-label="Also">
          {cs.tags.length > 0 && (
            <>
              <h2>About</h2>
              <ul>{cs.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
          <h2>Elsewhere on the site</h2>
          <ul>
            <li><Link href="/portfolio">The whole record</Link></li>
            <li><Link href="/projects">Every tool, including the older ones</Link></li>
            <li><Link href="/contact">Tell me about a task your team keeps doing by hand</Link></li>
          </ul>
        </aside>
      </div>

      <section className="cs-next" aria-labelledby="next-h">
        <h2 id="next-h">Related</h2>
        <ul>
          {next.map((c) => (
            <li key={c.slug}>
              <Link href={`/case-studies/${c.slug}`}>
                <b>{c.title}</b>
                <span>{[c.for, c.status].filter(Boolean).join(', ')}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
