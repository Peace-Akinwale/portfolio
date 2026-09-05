import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

/** Availability or status pill with a live dot. */
export function Pill({ children, dot = true, className }: { children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />}
      {children}
    </span>
  );
}
