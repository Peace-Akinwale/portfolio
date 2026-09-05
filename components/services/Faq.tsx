import { Container, Reveal, Section } from '@/components/ui';
import { FAQS } from '@/lib/content/services';

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** Questions people ask before a call. Native disclosure, FAQPage schema. */
export function Faq() {
  return (
    <Section rule>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
          <Reveal>
            <h2 className="t-h2 max-w-[16ch] text-foreground">Questions I get a lot</h2>
            <p className="mt-4 max-w-[36ch] text-muted-foreground">Everything you might want to know before we talk.</p>
          </Reveal>
          <Reveal className="border-b border-border">
            {FAQS.map((item) => (
              <details key={item.q} className="group border-t border-border">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-semibold text-foreground">{item.q}</span>
                  <span aria-hidden className="mt-0.5 shrink-0 text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-6 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
