import { Button, Quote, Reveal } from '@/components/ui';
import { testimonial } from '@/lib/content/testimonials';
import { Chapter } from './Chapter';

/** Chapter 5. Three clients, set as pull quotes on the paper. */
export function InTheirWords() {
  const lead = testimonial('regine');
  const rest = [testimonial('nathan'), testimonial('lily')];

  return (
    <Chapter number="05" title="In their words" id="in-their-words">
      <Reveal>
        <Quote name={lead.name} role={lead.role} company={lead.company} photo={lead.photo} size="lg" className="max-w-[40ch]">
          {lead.quote}
        </Quote>
      </Reveal>

      <div className="mt-16 grid gap-12 border-t border-border pt-12 md:grid-cols-2 md:gap-x-16">
        {rest.map((t) => (
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
    </Chapter>
  );
}
