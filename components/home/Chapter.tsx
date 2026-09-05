import type { ReactNode } from 'react';
import { Container } from '@/components/ui';
import { cx } from '@/lib/cx';

type Ground = 'paper' | 'surface' | 'muted';

const grounds: Record<Ground, string> = {
  paper: 'bg-background',
  surface: 'bg-surface',
  muted: 'bg-muted',
};

/**
 * One chapter of the homepage. A hard cut (hairline + ground) on top, a folio
 * in the left margin that sticks while the chapter is on screen, and the
 * chapter's content in the right column. Below lg the folio sits above.
 */
export function Chapter({
  number,
  title,
  id,
  ground = 'paper',
  silence = false,
  className,
  children,
}: {
  number: string;
  title: string;
  id: string;
  ground?: Ground;
  /** Extra air above the content: the quiet before a loud chapter. */
  silence?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-chapter={number}
      data-chapter-title={title}
      className={cx('border-t border-border scroll-mt-4', grounds[ground], silence ? 'pt-[22vh] pb-[12vh]' : 'section-y', className)}
    >
      <Container className="lg:grid lg:grid-cols-[8rem_minmax(0,1fr)] lg:gap-x-12">
        <aside className="mb-8 lg:mb-0">
          <div className="t-label tabular flex items-baseline gap-3 text-muted-foreground lg:sticky lg:top-8 lg:flex-col lg:gap-2">
            <span className="text-foreground">{number}</span>
            <span>{title}</span>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </Container>
    </section>
  );
}
