import { Container, Reveal, Section } from '@/components/ui';
import { SERVICES, WHATS_INCLUDED, WHATS_NOT } from '@/lib/content/services';
import { cx } from '@/lib/cx';

/** Three ways to work together, as a stacked ledger rather than three equal cards. */
export function Pricing() {
  return (
    <Section id="pricing" rule>
      <Container>
        <Reveal className="max-w-[62ch]">
          <h2 className="t-h2 text-foreground">Three ways to work together</h2>
          <p className="mt-4 text-muted-foreground">
            Pick what fits where you are. Not sure? One article is always a good place to start.
          </p>
        </Reveal>

        <ol className="mt-12 border-b border-border">
          {SERVICES.map((s) => (
            <Reveal
              as="li"
              key={s.id}
              id={s.id}
              className={cx(
                'grid gap-x-12 gap-y-6 border-t border-border py-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
                s.featured && 'bg-surface -mx-[var(--gutter)] px-[var(--gutter)]',
              )}
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="t-label text-accent">{s.tag}</p>
                  {s.featured && <p className="t-label rounded-full border border-border px-2.5 py-1 text-muted-foreground">Most common choice</p>}
                </div>
                <h3 className="t-h3 mt-4 text-foreground">{s.name}</h3>
                <p className="t-h1 tabular mt-6 text-foreground">{s.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.priceNote}</p>
              </div>
              <ul className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted-foreground lg:pt-1">
                {s.features.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="t-label mb-5 text-foreground">Included in every article</p>
            <ul className="flex flex-col gap-2.5 border-t border-border pt-5 text-[15px] leading-relaxed text-muted-foreground">
              {WHATS_INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label mb-5 text-foreground">Not included</p>
            <ul className="flex flex-col gap-2.5 border-t border-border pt-5 text-[15px] leading-relaxed text-muted-foreground">
              {WHATS_NOT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
