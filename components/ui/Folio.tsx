'use client';

import { useEffect, useState } from 'react';
import { cx } from '@/lib/cx';

type Chapter = { id: string; number: string; title: string };

/**
 * A margin folio: the current chapter's number and title, fixed in the left
 * gutter and updated as [data-chapter] sections pass. Doubles as a contents list.
 */
export function Folio({ className }: { className?: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
    setChapters(
      nodes.map((n) => ({
        id: n.id,
        number: n.dataset.chapter ?? '',
        title: n.dataset.chapterTitle ?? '',
      })),
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (chapters.length === 0) return null;

  return (
    <nav
      aria-label="Chapters"
      className={cx(
        'pointer-events-none fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 lg:block',
        'pl-[max(1rem,calc((100vw-72rem)/2-5.5rem))]',
        className,
      )}
    >
      <ol className="pointer-events-auto flex flex-col gap-2.5">
        {chapters.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cx(
                  't-label tabular flex items-center gap-2 transition-opacity',
                  isActive ? 'text-foreground opacity-100' : 'text-muted-foreground opacity-45 hover:opacity-100',
                )}
              >
                <span className="w-5 shrink-0">{c.number}</span>
                <span
                  className={cx(
                    'max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300',
                    isActive && 'max-w-[12rem]',
                  )}
                >
                  {c.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
