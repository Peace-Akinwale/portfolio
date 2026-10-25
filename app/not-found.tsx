import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

const PLACES = [
  { href: '/portfolio', label: 'The work', note: 'What I built, wrote and decided, newest first, plus every writing sample by client' },
  { href: '/case-studies', label: 'Case studies', note: 'The tools, one page each, and the ManyRequests engagement' },
  { href: '/blog', label: 'Blog', note: 'Articles on writing for B2B SaaS and on building with AI coding agents' },
  { href: '/services', label: 'Services and prices', note: 'What I write and build, and what it costs' },
  { href: '/contact', label: 'Contact', note: 'Book a call or send a message' },
];

export default function NotFound() {
  return (
    <div className="gutter mx-auto max-w-[1180px] py-20">
      <div className="max-w-[60ch]">
        <p className="eyebrow mb-4">404</p>
        <h1>This page doesn’t exist, or it moved.</h1>
        <p className="serif mt-4 text-[1.15rem]">If you followed a link to an old article, it may have a new address. These are the pages most people are looking for.</p>
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
