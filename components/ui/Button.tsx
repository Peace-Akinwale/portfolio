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

function classes(variant: Variant, size: Size, className?: string) {
  return cx(base, variants[variant], variant === 'text' ? 'px-0 py-0' : sizes[size], className);
}

export function Button(props: ButtonProps) {
  const { variant = 'solid', size = 'md', className, children } = props;
  const cls = classes(variant, size, className);

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    const isExternal = external || href.startsWith('http') || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          data-pressable=""
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-pressable="" {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, external: _e, ...rest } = props;
  return (
    <button className={cls} type={rest.type ?? 'button'} {...rest}>
      {children}
    </button>
  );
}
