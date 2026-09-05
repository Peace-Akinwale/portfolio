import { Button, Container, Quote, Reveal, Section, Stat } from '@/components/ui';
import { PUBLISHED_CASE_STUDIES } from '@/lib/content/case-studies';
import { testimonial } from '@/lib/content/testimonials';

/** The lead case study, with its real figures and the client's sentence. */
export function CaseStudyTeaser() {
  const cs = PUBLISHED_CASE_STUDIES[0];
  const t = testimonial('regine');
  if (!cs) return null;

  return (
    <Section rule ground="surface">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20">
          <Reveal>
            <p className="t-label mb-6 text-muted-foreground">Case study</p>
            <h2 className="t-h2 text-foreground">{cs.headline}</h2>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">{cs.summary}</p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {cs.stats.map((s) => (
                <Stat key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
            <div className="mt-10">
              <Button variant="text" href={`/case-studies/${cs.slug}`}>
                Read the full breakdown
              </Button>
            </div>
          </Reveal>
          <Reveal className="lg:pt-12">
            <Quote name={t.name} role={t.role} company={t.company} photo={t.photo}>
              {t.pull}
            </Quote>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
