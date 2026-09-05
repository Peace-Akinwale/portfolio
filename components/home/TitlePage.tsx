import Link from 'next/link';
import { Button, Container, Pill } from '@/components/ui';
import { AVAILABILITY } from '@/lib/content/clients';
import { Masthead } from './Masthead';

export const CHAPTERS = [
  { number: '01', title: 'The question', id: 'the-question' },
  { number: '02', title: 'The redline', id: 'the-redline' },
  { number: '03', title: 'The record', id: 'the-record' },
  { number: '04', title: 'The systems', id: 'the-systems' },
  { number: '05', title: 'In their words', id: 'in-their-words' },
  { number: '06', title: 'Colophon', id: 'colophon' },
];

/** Chapter 0. Type on paper, nothing above the fold but the argument. */
export function TitlePage() {
  return (
    <section id="top" className="bg-background">
      <Container className="flex min-h-svh flex-col">
        <Masthead />

        <div className="reveal-group flex flex-1 flex-col justify-center py-16 sm:py-24">
          <p className="t-label mb-8 text-muted-foreground" style={{ ['--i' as string]: 0 }}>
            B2B SaaS content writer, Lagos
          </p>
          <h1 className="t-display max-w-[13ch] text-foreground" style={{ ['--i' as string]: 1 }}>
            Product-led content for B2B SaaS.
          </h1>
          <p className="t-lede mt-8 max-w-[44ch] text-muted-foreground" style={{ ['--i' as string]: 2 }}>
            Your product should show up in the article because it solves the reader&rsquo;s problem, not because a line
            in the brief said &ldquo;mention it somewhere.&rdquo; That is the whole method. The rest of this page shows it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ ['--i' as string]: 3 }}>
            <Button variant="text" href="#the-redline">
              Watch an edit
            </Button>
            <Button variant="text" href="/case-studies">
              Read the record
            </Button>
            <Pill>{AVAILABILITY}</Pill>
          </div>
        </div>

        <nav aria-label="Contents" className="border-t border-border py-6">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <Link href={`#${c.id}`} className="t-label tabular flex items-baseline gap-3 py-1 text-muted-foreground hover:text-foreground">
                  <span>{c.number}</span>
                  <span>{c.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </section>
  );
}
