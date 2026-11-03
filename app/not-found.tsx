import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

const PLACES = [
  { href: '/services', label: 'Services', note: 'What I write and build, and what it costs' },
  { href: '/case-studies', label: 'Case studies', note: 'One page per tool, with the whole story' },
  { href: '/portfolio', label: 'Writing', note: 'Every writing sample by client, and what clients said' },
  { href: '/blog', label: 'The blog', note: 'Posts about writing for B2B SaaS and directing AI coding agents through a build' },
  { href: '/contact', label: 'Say hi', note: 'Book a call or send a message' },
];

export default function NotFound() {
  return (
    <div className="gutter mx-auto max-w-[1180px] py-20">
      <div className="max-w-[60ch]">
        <p className="eyebrow mb-4">404</p>
        <h1>Hmm, there’s nothing here.</h1>
        <p className="serif mt-4 text-[1.15rem]">Maybe the link is old, or I moved something. Here’s where most people are headed.</p>
        <ul className="mt-10 border-t border-border">
          {PLACES.map((place) => (
            <li key={place.href} className="border-b border-border">
              <Link href={place.href} className="group flex flex-col gap-1 py-5 no-underline">
                <span className="display text-[1.4rem] font-[520] group-hover:underline">{place.label}</span>
                <span className="text-[14.5px] text-muted-foreground">{place.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
