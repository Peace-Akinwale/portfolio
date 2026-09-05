import { IndexList, IndexRow, Reveal } from '@/components/ui';
import { SYSTEMS } from '@/lib/content/systems';
import { Chapter } from './Chapter';

/** Chapter 4. The tools, labelled like objects in a collection. */
export function TheSystems() {
  return (
    <Chapter number="04" title="The systems" id="the-systems" ground="muted">
      <Reveal>
        <h2 className="t-h1 max-w-[18ch] text-foreground">Built because a bottleneck existed.</h2>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          A writer who learned to think in systems and use AI as infrastructure. None of these write the article. They
          take the parts of the job that should not need a human, so the judgment calls get the time.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <IndexList>
          {SYSTEMS.map((s) => (
            <IndexRow key={s.name} title={s.name} href={s.href} description={s.what} meta={s.stack} aside={s.year} />
          ))}
        </IndexList>
      </Reveal>
    </Chapter>
  );
}
