import type { ReactNode } from 'react';
import { Button, Container, Pill, Section } from '@/components/ui';
import { AVAILABILITY, CALENDLY_URL } from '@/lib/content/clients';

/** The closing ask on inner pages. One heading, one line, two actions. */
export function CtaBlock({
  title = 'Talk through your content goals.',
  lede = 'A 30-minute call, no commitment. Or send a message and I will reply within one business day.',
  children,
}: {
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Section rule>
      <Container>
        <div className="max-w-[62ch]">
          <Pill className="mb-8">{AVAILABILITY}</Pill>
          <h2 className="t-h2 text-foreground">{title}</h2>
          <p className="t-lede mt-5 text-muted-foreground">{lede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={CALENDLY_URL}>Book a call</Button>
            <Button href="/contact" variant="outline">
              Send a message
            </Button>
          </div>
          {children}
        </div>
      </Container>
    </Section>
  );
}
