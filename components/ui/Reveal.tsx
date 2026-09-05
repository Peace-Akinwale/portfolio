import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '@/lib/cx';

/** Fades and rises on entry via CSS scroll-driven animation. Static fallback. */
export function Reveal<T extends ElementType = 'div'>({
  as,
  className,
  ...rest
}: { as?: T; className?: string } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>) {
  const Tag = (as ?? 'div') as ElementType;
  return <Tag className={cx('reveal', className)} {...rest} />;
}
