import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';

type Width = 'prose' | 'narrow' | 'default';

const widths: Record<Width, string> = {
  prose: 'max-w-3xl',
  narrow: 'max-w-4xl',
  default: 'max-w-6xl',
};

export function Container({
  width = 'default',
  className,
  ...rest
}: ComponentPropsWithoutRef<'div'> & { width?: Width }) {
  return <div className={cx('mx-auto w-full gutter', widths[width], className)} {...rest} />;
}
