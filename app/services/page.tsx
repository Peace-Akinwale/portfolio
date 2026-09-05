import type { Metadata } from 'next';
import { Button, Container, PageHeader, Pill, Quote, Reveal, Section } from '@/components/ui';
import { ClientRow } from '@/components/ClientRow';
import { CtaBlock } from '@/components/CtaBlock';
import { Pricing } from '@/components/services/Pricing';
import { Fit } from '@/components/services/Fit';
import { CaseStudyTeaser } from '@/components/services/CaseStudyTeaser';
import { Testimonials } from '@/components/services/Testimonials';
import { Process } from '@/components/services/Process';
import { Faq } from '@/components/services/Faq';
import { AVAILABILITY } from '@/lib/content/clients';
import { SERVICES } from '@/lib/content/services';
import { testimonial } from '@/lib/content/testimonials';

export const metadata: Metadata = {
  title: 'B2B SaaS Content Writer Services | Peace Akinwale',
  description:
    'B2B SaaS content writer services: product-led articles, content refreshes, BOFU blog posts, and AI-supported editorial systems for software companies.',
  keywords: ['B2B SaaS content writer', 'B2B SaaS content writer services', 'product-led content writer', 'SaaS content refresh services'],
  alternates: {
    canonical: 'https://peaceakinwale.com/services',
  },
};

export default function ServicesPage() {
  const proof = [testimonial('nathan'), testimonial('lily')];

  return (
    <>
      <PageHeader
        label="Services"
        title="Product-led BOFU articles for B2B SaaS companies publishing 4+ articles a month"
        lede="Articles that rank on Google, surface in LLM search, and show your product solving real problems. No account managers, just you and me. I also build automations for the parts of the job that should not need a human."
      >
        <dl className="grid grid-cols-3 gap-6 border-y border-border py-5">
          {SERVICES.map((s) => (
            <div key={s.id}>
              <dt className="t-label text-muted-foreground">{s.tag}</dt>
              <dd className="mt-2">
                <a href={`#${s.id}`} className="font-display tabular text-xl font-bold text-foreground hover:text-accent">
                  {s.price}
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-4">
          <Button href="#pricing">See full pricing</Button>
          <Button href="/case-studies" variant="outline">
            See the work
          </Button>
          <Pill>{AVAILABILITY}</Pill>
        </div>
      </PageHeader>

      <Pricing />

      <Section rule ground="muted">
        <Container>
          <p className="t-label mb-10 text-muted-foreground">Heard from people who have hired me</p>
          <div className="grid gap-12 md:grid-cols-2 md:gap-x-16">
            {proof.map((t) => (
              <Reveal key={t.id}>
                <Quote name={t.name} role={t.role} company={t.company} photo={t.photo}>
                  {t.pull}
                </Quote>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Fit />

      <Container>
        <ClientRow />
      </Container>

      <CaseStudyTeaser />
      <Testimonials exclude={['regine']} />
      <Process />
      <Faq />
      <CtaBlock title="Ready to hire a B2B SaaS content writer?" lede="Book a free 30-minute discovery call. No commitment, no pressure." />
    </>
  );
}
