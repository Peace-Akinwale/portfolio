import { Container, Reveal, Section } from '@/components/ui';

const FITS = [
  {
    who: 'Head of content',
    says: 'You are publishing regularly but the articles do not show your product. They are educational, sure. But they do not convert.',
  },
  {
    who: 'Founder or growth lead',
    says: 'You know content is the play. You just do not have time to brief a writer, review drafts, and still run the company.',
  },
  {
    who: 'Content manager with an AI problem',
    says: 'Your team is using AI to scale output. But the articles sound the same, and your editor is tired of fixing them.',
  },
];

/** Who this is for, as a definition list. */
export function Fit() {
  return (
    <Section rule>
      <Container>
        <Reveal>
          <h2 className="t-h2 max-w-[20ch] text-foreground">You might be the right fit</h2>
        </Reveal>
        <Reveal as="dl" className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-3 md:gap-12">
          {FITS.map((f) => (
            <div key={f.who}>
              <dt className="t-label mb-4 text-accent">{f.who}</dt>
              <dd className="font-display text-[1.125rem] font-semibold leading-[1.45] tracking-[-0.01em] text-foreground">
                &ldquo;{f.says}&rdquo;
              </dd>
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
