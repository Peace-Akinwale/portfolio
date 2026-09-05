import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';

type Ground = 'paper' | 'surface' | 'muted';

const grounds: Record<Ground, string> = {
  paper: 'bg-background',
  surface: 'bg-surface',
  muted: 'bg-muted',
};

/**
 * A page block with fluid vertical padding and an optional hairline on top.
 * Grounds change on a hard edge, never on a gradient.
 */
export function Section({
  ground = 'paper',
  rule = false,
  tight = false,
  className,
  ...rest
}: ComponentPropsWithoutRef<'section'> & { ground?: Ground; rule?: boolean; tight?: boolean }) {
  return (
    <section
      className={cx(grounds[ground], rule && 'border-t border-border', tight ? 'py-12 sm:py-16' : 'section-y', className)}
      {...rest}
    />
  );
}
