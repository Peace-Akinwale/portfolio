import type { ReactNode } from 'react';
import { Container } from './Container';
import { cx } from '@/lib/cx';

/**
 * The opening of every inner page: one label, a display title, one lede.
 * The only place a page uses an eyebrow.
 */
export function PageHeader({
  label,
  title,
  lede,
  children,
  width = 'default',
  className,
}: {
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  width?: 'prose' | 'narrow' | 'default';
  className?: string;
}) {
  return (
    <Container width={width} className={cx('pt-10 pb-14 sm:pt-16 sm:pb-20', className)}>
      <div className="reveal-group max-w-[62ch]">
        {label && (
          <p className="t-label mb-6 text-accent" style={{ ['--i' as string]: 0 }}>
            {label}
          </p>
        )}
        <h1 className="t-h1 text-foreground" style={{ ['--i' as string]: 1 }}>
          {title}
        </h1>
        {lede && (
          <p className="t-lede mt-6 text-muted-foreground" style={{ ['--i' as string]: 2 }}>
            {lede}
          </p>
        )}
        {children && (
          <div className="mt-8" style={{ ['--i' as string]: 3 }}>
            {children}
          </div>
        )}
      </div>
    </Container>
  );
}
