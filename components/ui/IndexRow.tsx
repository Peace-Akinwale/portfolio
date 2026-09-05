import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type IndexRowProps = {
  number?: string;
  title: ReactNode;
  href?: string;
  meta?: ReactNode;
  aside?: ReactNode;
  description?: ReactNode;
  external?: boolean;
  className?: string;
};

/**
 * One line in an index: number, title, meta, and an aside (year, result).
 * The list is the layout. Hairlines separate rows; nothing is a card.
 */
export function IndexRow({ number, title, href, meta, aside, description, external, className }: IndexRowProps) {
  const isExternal = external ?? (href?.startsWith('http') ?? false);
  const titleEl = href ? (
    isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="group-hover:text-accent">
        {title}
        <span aria-hidden className="ml-1.5 text-muted-foreground">
          ↗
        </span>
      </a>
    ) : (
      <Link href={href} className="group-hover:text-accent">
        {title}
      </Link>
    )
  ) : (
    title
  );

  return (
    <li
      className={cx(
        'group grid gap-x-6 gap-y-1 border-t border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:py-6',
        className,
      )}
    >
      {number !== undefined && <span className="t-label tabular pt-1.5 text-muted-foreground">{number}</span>}
      <div className={cx('min-w-0', number === undefined && 'sm:col-span-2')}>
        <h3 className="t-h3 text-foreground">{titleEl}</h3>
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
        {description && (
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {aside && <span className="tabular pt-1.5 text-sm text-muted-foreground sm:text-right">{aside}</span>}
    </li>
  );
}

export function IndexList({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={cx('border-b border-border', className)}>{children}</ol>;
}
