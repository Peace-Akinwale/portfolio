import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

const PLACES = [
  { href: '/services', label: 'Services', note: 'What I write and build, and what it costs' },
  { href: '/case-studies', label: 'Case studies', note: 'One page per project, with the whole story' },
  { href: '/writing', label: 'Writing samples', note: 'Every writing sample by client, and what clients said' },
  { href: '/blog', label: 'The blog', note: 'Posts about writing for B2B SaaS and directing AI coding agents through a build' },
  { href: '/contact', label: 'Contact', note: 'Book a call or send a message' },
];

export default function NotFound() {
  return (
    <div className="gutter mx-auto max-w-[1180px] py-20">
      <div className="max-w-[60ch]">
        <p className="eyebrow mb-4">404</p>
        <h1>I couldn’t find that page</h1>
        <p className="serif mt-4 text-[1.15rem]">The link may have changed. You can browse my work or head back to the homepage.</p>
        <p className="mt-6 flex gap-6"><Link href="/writing">See my work</Link><Link href="/">Go to homepage</Link></p>
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
