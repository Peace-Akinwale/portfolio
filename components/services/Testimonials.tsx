import { Button, Container, Quote, Reveal, Section } from '@/components/ui';
import { TESTIMONIALS } from '@/lib/content/testimonials';

/** What clients say, as pull quotes in two columns. */
export function Testimonials({ exclude = [] }: { exclude?: string[] }) {
  const list = TESTIMONIALS.filter((t) => !exclude.includes(t.id));
  return (
    <Section rule>
      <Container>
        <Reveal>
          <h2 className="t-h2 text-foreground">What clients say</h2>
        </Reveal>
        <div className="mt-12 grid gap-12 border-t border-border pt-12 md:grid-cols-2 md:gap-x-16">
          {list.map((t) => (
            <Reveal key={t.id}>
              <Quote name={t.name} role={t.role} company={t.company} photo={t.photo}>
                {t.quote}
              </Quote>
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
          <Button variant="text" href="/testimonials">
            All testimonials
          </Button>
        </div>
      </Container>
    </Section>
  );
}
