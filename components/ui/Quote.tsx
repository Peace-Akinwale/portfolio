import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type QuoteProps = {
  children: ReactNode;
  name: string;
  role: string;
  company: string;
  photo?: string;
  size?: 'md' | 'lg';
  className?: string;
};

/** A pull quote set on the paper, with attribution. No card. */
export function Quote({ children, name, role, company, photo, size = 'md', className }: QuoteProps) {
  return (
    <figure className={cx('flex flex-col gap-5', className)}>
      <blockquote
        className={cx(
          'font-display font-semibold text-foreground',
          size === 'lg'
            ? 'text-[1.5rem] leading-[1.35] tracking-[-0.015em] sm:text-[1.75rem]'
            : 'text-[1.125rem] leading-[1.5] tracking-[-0.01em] sm:text-[1.25rem]',
        )}
      >
        {children}
      </blockquote>
      <figcaption className="flex items-center gap-3 text-sm">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" loading="lazy" />
        )}
        <span>
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-muted-foreground">
            , {role}, {company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
