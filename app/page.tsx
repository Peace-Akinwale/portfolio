import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/hashnode/client';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import { getFaviconUrl } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'B2B SaaS Content Writer | Peace Akinwale',
  description:
    'B2B SaaS content writer for product-led software companies. I write articles that rank, refresh content with business potential, and help brands show up in AI search.',
  keywords: [
    'B2B SaaS content writer',
    'product-led content writer',
    'B2B content writer',
    'SaaS content writer',
  ],
};

const CLIENTS = [
  { name: 'ManyRequests', domain: 'manyrequests.com' },
  { name: 'Jabra', domain: 'jabra.com' },
  { name: 'Marker.io', domain: 'marker.io' },
  { name: 'HigherVisibility', domain: 'highervisibility.com' },
  { name: 'Pangea.ai', domain: 'pangea.ai' },
  { name: 'Spicy Margarita', domain: 'spicymargarita.co' },
].map(c => ({ ...c, favicon: getFaviconUrl(c.domain, 32) }));

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://peaceakinwale.com/#home',
  url: 'https://peaceakinwale.com',
  name: 'Peace Akinwale | B2B SaaS Content Writer',
  description:
    'Homepage for Peace Akinwale, a B2B SaaS content writer who specializes in product-led content, content refreshes, and AI-search-friendly articles.',
  about: {
    '@type': 'Person',
    name: 'Peace Akinwale',
    jobTitle: 'B2B SaaS content writer',
  },
  mainEntity: {
    '@type': 'Service',
    name: 'B2B SaaS content writing',
    provider: {
      '@type': 'Person',
      name: 'Peace Akinwale',
    },
    serviceType: 'B2B SaaS content writer',
  },
};

const TESTIMONIALS = [
  {
    quote: <span>Peace specializes in product-led blog content, and it really shows in his work. He doesn&rsquo;t chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. <strong className="text-foreground font-semibold">His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</strong></span>,
    name: 'Regine Garcia',
    role: 'Head of Content',
    company: 'ManyRequests',
    photo: '/images/clients/regine-garcia.png',
    initials: 'RG',
  },
  {
    quote: <span>I&rsquo;m particularly impressed by his ability to follow briefs to a T, yet <strong className="text-foreground font-semibold">adapt and reorganize information on the fly</strong> based on what he knows about our ICP. He keeps to deadlines, and we never needed more than one round of feedback per article &mdash; and none towards the end of our project.</span>,
    name: 'Nathan Vander Heyden',
    role: 'Head of Marketing',
    company: 'Marker.io',
    photo: '/images/clients/nathan-vander-heyden.jpg',
    initials: 'NV',
  },
  {
    quote: <span>Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. <strong className="text-foreground font-semibold">He took feedback really fast and always came back stronger</strong> &mdash; the kind of person who makes your work easier just by being on the team.</span>,
    name: 'Lily Ugbaja',
    role: 'Head of Content',
    company: 'Spicy Margarita',
    photo: '/images/clients/lily-ugbaja.png',
    initials: 'LU',
  },
];

export default async function HomePage() {
  const { posts } = await getPosts(3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.78fr)] lg:items-center">
            <div className="order-last max-w-3xl lg:order-first">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Currently accepting 2 new clients
              </span>
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
                style={{ color: 'var(--accent)' }}
              >
                B2B SaaS Content Writer
              </p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 text-foreground"
                style={{ letterSpacing: '-0.03em' }}
              >
                Product-led content for B2B&nbsp;SaaS
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mb-10">
                Your product should show up in the article because it genuinely solves the problem, not because a brief said &ldquo;mention it somewhere.&rdquo; That&rsquo;s how I write.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
                <Link
                  href="/portfolio"
                  className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 text-center"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  See my work &rarr;
                </Link>
                <Link
                  href="/services"
                  className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md border border-border text-foreground transition-all hover:bg-muted text-center"
                >
                  View services
                </Link>
                <Link
                  href="/contact"
                  className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4 transition-colors hover:opacity-70 text-center sm:text-left"
                  style={{ color: 'var(--accent2, var(--accent))' }}
                >
                  Book a free call
                </Link>
              </div>
              <article className="mt-8 max-w-xl rounded-xl border border-border bg-muted/70 px-5 py-4">
                <p
                  className="text-[15px] leading-[1.7] text-foreground"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  &ldquo;His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.&rdquo;
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Regine Garcia · Head of Content, ManyRequests
                </p>
              </article>
            </div>

            <div className="order-first w-full max-w-[400px] mx-auto lg:order-last lg:max-w-[430px] lg:justify-self-end">
              <div
                className="border border-border bg-background/92 p-1.5 shadow-[0_14px_36px_rgba(23,15,13,0.06)]"
                style={{ borderRadius: '20px' }}
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-muted sm:aspect-[4/5]" style={{ borderRadius: '15px' }}>
                  <Image
                    src="/images/Peace Akinwale portrait.jpg"
                    alt="Peace Akinwale portrait"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 430px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Client logos ─────────────────────────────── */}
      <section style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="flex-1 h-px bg-border" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
              Written for brands like
            </p>
            <span className="flex-1 h-px bg-border" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-3">
            {CLIENTS.map((c, i) => (
              <span key={c.domain} className="flex items-center">
                <span className="flex items-center gap-2 px-4 py-2 opacity-75 hover:opacity-100 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.favicon} alt="" width={18} height={18} className="rounded" loading="lazy" />
                  <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
                </span>
                {i < CLIENTS.length - 1 && (
                  <span className="text-border select-none" aria-hidden>&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results strip ────────────────────────────── */}
      <section className="border-b border-border" style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold mb-2" style={{ letterSpacing: '-0.04em', color: 'var(--accent)' }}>233%</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Organic traffic growth for HigherVisibility</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2" style={{ letterSpacing: '-0.04em', color: 'var(--accent)' }}>6+</p>
              <p className="text-xs text-muted-foreground leading-relaxed">B2B SaaS brands published at</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2" style={{ letterSpacing: '-0.04em', color: 'var(--accent)' }}>1 round</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Average revisions per article</p>
            </div>
            <div>
              <p className="inline-block text-xs font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full mb-3" style={{ background: 'var(--accent)', color: '#fff' }}>Cited in LLM search engines</p>
              <p className="text-xs text-muted-foreground leading-relaxed">My clients get mentioned in ChatGPT, Perplexity, and Google AI Overviews for relevant queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services teaser ──────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
            What I offer
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            How we work.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              {
                tag: 'Content Refresh',
                heading: 'Refreshing old content is often better than publishing new.',
                body: 'I look at what\'s lost traffic over the past year, close gaps in competitor content, and rewrite to match the search intent that actually converts today.',
              },
              {
                tag: 'Net New Article',
                heading: 'One article, done right',
                body: 'Product-led, thoroughly researched, and optimized for Google and LLM search. I only take on topics where your product can appear naturally — no forcing it.',
                featured: true,
              },
              {
                tag: 'Monthly Retainer',
                heading: '5 BOFU articles per month.',
                body: 'Topic strategy included. You work directly with me — no account managers, no rotating writers, no starting from scratch every time you send a brief.',
              },
            ].map((s) => (
              <div
                key={s.tag}
                className={`rounded-xl border p-7 flex flex-col ${
                  s.tag === 'Monthly Retainer'
                    ? 'border-accent/40 ring-1 ring-accent/10 md:order-2'
                    : s.tag === 'Net New Article'
                      ? 'border-border md:order-3'
                      : 'border-border md:order-1'
                }`}
                style={{ background: s.tag === 'Monthly Retainer' ? 'var(--muted)' : 'var(--background)' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] mb-4 block" style={{ color: 'var(--accent)' }}>{s.tag}</span>
                {s.tag === 'Monthly Retainer' && (
                  <span className="inline-flex items-center self-start rounded-full border border-accent/20 bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                    Most common choice
                  </span>
                )}
                <p className="text-sm font-bold text-foreground mb-3 leading-snug">{s.heading}</p>
                <p className="text-[13px] leading-[1.7] text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/services"
            className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4 transition-colors hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            See full services and pricing &rarr;
          </Link>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
            What clients say
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            From the people who hired me.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-7 flex flex-col justify-between">
                <p className="text-sm leading-[1.85] text-muted-foreground mb-7" style={{ fontFamily: 'var(--font-serif)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photo} alt={t.name} width={36} height={36} className="flex-shrink-0 w-9 h-9 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold bg-muted text-muted-foreground">{t.initials}</span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} &middot; {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About snippet ────────────────────────────── */}
      <section className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
            <div
              className="relative overflow-hidden w-[240px] sm:w-[280px] mx-auto md:mx-0 rounded-xl border border-border"
              style={{ aspectRatio: '3 / 4', borderLeftWidth: '4px', borderLeftColor: 'var(--accent2)' }}
            >
              <Image
                src="/images/peace-akinwale-about-wedding.jpg"
                alt="Peace Akinwale"
                fill
                className="object-cover object-top"
              />
            </div>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
                style={{ color: 'var(--accent)' }}
              >
                About me
              </p>
              <h2
                className="text-2xl sm:text-3xl font-extrabold mb-6 text-foreground"
                style={{ letterSpacing: '-0.02em' }}
              >
                Peace Akinwale
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground mb-3">
                I&rsquo;m a B2B SaaS content writer in Lagos, Nigeria. I write product-led content for companies like ManyRequests, Marker.io, and Jabra &mdash; articles where the product shows up because it genuinely solves the problem being discussed.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                I also build lightweight AI systems that take manual work off content teams so they can focus on higher-stakes decisions.
              </p>
              <Link
                href="/about"
                className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4 transition-colors hover:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                More about me &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog posts ───────────────────────────────── */}
      {posts.length > 0 && (
        <section className="border-t border-border" style={{ background: 'var(--muted)' }}>
          <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
              From the blog
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
              style={{ letterSpacing: '-0.02em' }}
            >
              How I think about content.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group flex flex-col">
                  {post.coverImage?.url && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4 border border-border">
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <p className="text-[13px] font-bold text-foreground leading-snug mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {post.brief}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    <span>&middot;</span>
                    <span>{formatReadingTime(post.readTimeInMinutes)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12">
              <Link
                href="/blog"
                className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4 transition-colors hover:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                Read all articles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Currently accepting 2 new clients
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-4 text-foreground"
              style={{ letterSpacing: '-0.02em' }}
            >
              Ready to hire a B2B SaaS content writer?
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-10 max-w-xl">
              Let&rsquo;s talk about your content goals. Book a free 30-minute discovery call. No commitment, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://calendly.com/akindayopeaceakinwale/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 text-center"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Book a free discovery call &rarr;
              </a>
              <Link
                href="/contact"
                className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md border border-border text-foreground transition-all hover:bg-muted text-center"
              >
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
