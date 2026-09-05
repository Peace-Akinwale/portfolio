import { Container, Reveal, Section } from '@/components/ui';
import { PROCESS } from '@/lib/content/services';

/** From brief to published, in four numbered steps. */
export function Process() {
  return (
    <Section rule>
      <Container>
        <Reveal>
          <h2 className="t-h2 text-foreground">From brief to published</h2>
        </Reveal>
        <Reveal as="ol" className="mt-12 grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s) => (
            <li key={s.step}>
              <p className="t-label tabular mb-4 text-muted-foreground">{s.step}</p>
              <h3 className="t-h3 text-foreground">{s.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
