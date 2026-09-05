import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from '@/lib/cx';

type Variant = 'solid' | 'outline' | 'text';
type Size = 'sm' | 'md';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>;

type NativeProps = CommonProps & {
  href?: undefined;
  external?: undefined;
} & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export type ButtonProps = LinkProps | NativeProps;

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold select-none disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  solid: 'rounded-full bg-accent text-accent-foreground hover:opacity-90',
  outline: 'rounded-full border border-border text-foreground hover:border-foreground',
  text: 'rounded-sm text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent',
};

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-4 py-2',
  md: 'text-sm px-6 py-3',
};

export function Button(props: ButtonProps) {
  const { variant = 'solid', size = 'md', className, children, href, external, ...rest } = props;
  const cls = cx(base, variants[variant], variant === 'text' ? 'px-0 py-0' : sizes[size], className);

  if (href !== undefined) {
    const anchorRest = rest as Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>;
    const isMail = href.startsWith('mailto:');
    const isExternal = external || href.startsWith('http') || isMail;
    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          data-pressable=""
          target={isMail ? undefined : '_blank'}
          rel={isMail ? undefined : 'noopener noreferrer'}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-pressable="" {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;
  return (
    <button className={cls} type={buttonRest.type ?? 'button'} {...buttonRest}>
      {children}
    </button>
  );
}
