import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';

/** Small uppercase label. Use at most once per three sections. */
export function Eyebrow({
  className,
  tone = 'accent',
  ...rest
}: ComponentPropsWithoutRef<'p'> & { tone?: 'accent' | 'muted' }) {
  return (
    <p
      className={cx('t-label', tone === 'accent' ? 'text-accent' : 'text-muted-foreground', className)}
      {...rest}
    />
  );
}
