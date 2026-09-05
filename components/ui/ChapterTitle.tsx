import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

/** An intertitle: chapter label above, display heading below. */
export function ChapterTitle({
  label,
  children,
  as: Tag = 'h2',
  className,
}: {
  label?: string;
  children: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <header className={cx('flex flex-col gap-4', className)}>
      {label && <p className="t-label text-muted-foreground">{label}</p>}
      <Tag className="t-h1 max-w-[18ch] text-foreground">{children}</Tag>
    </header>
  );
}
