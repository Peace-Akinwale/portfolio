import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | Peace Akinwale',
  robots: { index: false },
};

const PLACES = [
  { href: '/portfolio', label: 'Writing samples', note: 'Published work for ManyRequests, Marker.io, Jabra and others' },
  { href: '/blog', label: 'Blog', note: 'Notes on product-led content, AEO and building with Claude' },
  { href: '/services', label: 'Services and pricing', note: 'What I write and what it costs' },
  { href: '/contact', label: 'Contact', note: 'Book a call or send a message' },
];

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
      <div className="max-w-2xl">
        <p className="text-sm text-muted-foreground mb-4">404</p>
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-foreground leading-[1.1] mb-6"
          style={{ letterSpacing: '-0.03em' }}
        >
          This page doesn&rsquo;t exist, or it moved.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground mb-12">
          If you followed a link to an old article, it may have a new address. These are the pages most people are looking for:
        </p>

        <ul className="divide-y divide-border border-y border-border">
          {PLACES.map((place) => (
            <li key={place.href}>
              <Link href={place.href} className="group flex flex-col gap-1 py-5 transition-colors">
                <span className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                  {place.label} &rarr;
                </span>
                <span className="text-sm text-muted-foreground">{place.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
