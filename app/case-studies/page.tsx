import type { Metadata } from 'next';
import { Container, IndexList, IndexRow, PageHeader, Reveal, Stat } from '@/components/ui';
import { CtaBlock } from '@/components/CtaBlock';
import { PUBLISHED_CASE_STUDIES } from '@/lib/content/case-studies';

export const metadata: Metadata = {
  title: 'Case Studies | Peace Akinwale',
  description:
    'Deep-dives into B2B SaaS content engagements: what I was hired to do, how I approached it, and what the work produced.',
  alternates: {
    canonical: 'https://peaceakinwale.com/case-studies',
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        label="Case studies"
        title="Client work, broken down"
        lede="What I was hired to do, how I approached it, and what the work produced. Numbers where I have them."
      />

      <Container className="pb-8">
        <Reveal>
          <IndexList>
            {PUBLISHED_CASE_STUDIES.map((cs, i) => (
              <IndexRow
                key={cs.slug}
                number={String(i + 1).padStart(2, '0')}
                title={cs.client}
                href={`/case-studies/${cs.slug}`}
                meta={cs.format}
                description={cs.summary}
                aside={cs.year}
              />
            ))}
          </IndexList>
        </Reveal>

        {PUBLISHED_CASE_STUDIES[0] && (
          <Reveal className="mt-12 grid max-w-3xl grid-cols-3 gap-6">
            {PUBLISHED_CASE_STUDIES[0].stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </Reveal>
        )}
      </Container>

      <CtaBlock title="Want a breakdown like this for your product?" lede="If your blog publishes regularly but the product never really shows up in the work, that is usually where I start." />
    </>
  );
}
