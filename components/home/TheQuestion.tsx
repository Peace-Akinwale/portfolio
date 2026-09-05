import { Reveal } from '@/components/ui';
import { Chapter } from './Chapter';

const SCALE = [
  { score: '3', label: 'The product is the answer. The article cannot be written honestly without it.' },
  { score: '2', label: 'The product helps with a real step in the piece. It earns a place in the how-to.' },
  { score: '1', label: 'The product can only be mentioned in passing. Usually a sign to change the angle.' },
  { score: '0', label: 'No honest way to bring the product in. Traffic with no buyer attached.' },
];

/** Chapter 1. The one question every topic has to answer first. */
export function TheQuestion() {
  return (
    <Chapter number="01" title="The question" id="the-question">
      <Reveal>
        <h2 className="t-h1 max-w-[20ch] text-foreground">
          Will we be able to talk about the product here, without forcing it?
        </h2>
      </Reveal>

      <Reveal className="mt-10 max-w-[62ch]">
        <p className="text-lg leading-relaxed text-muted-foreground">
          I ask it before I agree to write anything. It is the core of the Ahrefs business potential score: grade every
          topic on how naturally the product can feature while the piece covers what the reader came for. I only pursue
          threes and twos. Most editorial calendars skip this filter, and the articles read like it.
        </p>
      </Reveal>

      <Reveal as="dl" className="mt-12 grid max-w-[62ch] gap-y-5 border-t border-border pt-6">
        {SCALE.map((s) => (
          <div key={s.score} className="grid grid-cols-[3rem_1fr] gap-x-4">
            <dt className="font-display tabular text-2xl font-bold leading-none text-foreground">{s.score}</dt>
            <dd className="text-[15px] leading-relaxed text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </Reveal>
    </Chapter>
  );
}
