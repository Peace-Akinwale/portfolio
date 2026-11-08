import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudy, listCaseStudies } from '@/lib/content/case-studies';
import { ContentPage } from '@/components/ContentPage';
import { SITE_URL } from '@/lib/site';
import { withOg } from '@/lib/og';
import { JsonLdScript } from '@/components/JsonLdScript';
import { breadcrumbList, softwareApplicationJsonLd } from '@/lib/seo/jsonld';

export const dynamicParams = false;

export function generateStaticParams() {
  return listCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return withOg({
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: SITE_URL + '/case-studies/' + cs.slug },
  }, { key: 'case-study-' + cs.slug, path: '/case-studies/' + cs.slug, alt: cs.title, type: 'article' });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const jsonLd = [
    breadcrumbList([{ name: 'Case studies', url: '/case-studies' }, { name: cs.name, url: '/case-studies/' + cs.slug }]),
    ...(slug === 'ai-docs-watch' ? [softwareApplicationJsonLd({ name: cs.name, description: cs.summary, url: 'https://docswatch.stevetoth.ai', applicationCategory: 'BusinessApplication' })] : []),
  ];
  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ContentPage title={cs.title} html={cs.html} published={cs.published} caseStudy />
    </>
  );
}
