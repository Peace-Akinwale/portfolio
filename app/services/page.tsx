import Link from 'next/link';
import type { Metadata } from 'next';
import { getFaviconUrl } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'B2B SaaS Content Writer Services | Peace Akinwale',
  description:
    'B2B SaaS content writer services: product-led articles, content refreshes, BOFU blog posts, and AI-supported editorial systems for software companies.',
  keywords: [
    'B2B SaaS content writer',
    'B2B SaaS content writer services',
    'product-led content writer',
    'SaaS content refresh services',
  ],
  alternates: {
    canonical: 'https://peaceakinwale.com/services',
  },
};

const CLIENTS = [
  { name: 'ManyRequests', domain: 'manyrequests.com' },
  { name: 'Jabra', domain: 'jabra.com' },
  { name: 'Marker.io', domain: 'marker.io' },
  { name: 'HigherVisibility', domain: 'highervisibility.com' },
  { name: 'Pangea.ai', domain: 'pangea.ai' },
  { name: 'Spicy Margarita', domain: 'spicymargarita.co' },
].map(c => ({ ...c, favicon: getFaviconUrl(c.domain, 32) }));

const CONTENT_SERVICES = [
  {
    tag: 'Content Refresh',
    name: 'Refresh one article',
    price: '$400',
    priceNote: 'per article · 2,000–2,500 words',
    features: [
      'Refreshing is most times better than publishing new content.',
      "I look at gaps in your competitors' content and write to meet the ‘new’ search intent.",
      <span key="f3">I weave your product into the article without forcing it, so the reader leaves knowing <strong className="text-foreground font-semibold">what you do</strong> and <strong className="text-foreground font-semibold">when they might need you</strong>.</span>,
      'I swap out old product images, add GIFs, and update alt texts and CTAs where relevant.',
      'I optimize for organic and AI search engines to improve visibility.',
    ],
  },
  {
    tag: '5-Article Bundle',
    name: 'Product-led articles that move readers',
    price: '$2,700',
    priceNote: '5 articles · save 10% · flexible scope',
    featured: true,
    features: [
      'Well-written, product-led articles that move readers to make a decision about your product.',
      'Flexible scope — need a 6th or 7th article? Easy to add at the discounted rate.',
      'You work directly with me. No account managers, rotating writers, or starting from scratch every brief.',
      <span key="f4">If a draft misses the mark, <strong className="text-foreground font-semibold">we work on it together</strong> until it reads better, usually with two rounds of feedback when we are just starting out.</span>,
      'Automation or editorial systems work available as an add-on.',
    ],
  },
  {
    tag: 'Net New Article',
    name: 'One article, done right',
    price: '$600',
    priceNote: 'per article · 2,000–3,000 words · bundle 3+ for 10% off',
    features: [
      'I evaluate whether we can talk about your product in the article without forcing it, even on a TOFU blog post.',
      'I use your product and read help docs so I understand where it fits in the assigned topics and how it differs from competitors’.',
      'I optimize for organic and AI search engines and write to meet search intent.',
      'I think beyond the brief — every article has a job to do, and I write to that outcome.',
    ],
  },
];

const WHATS_INCLUDED = [
  '2,000–3,000 words per article',
  '1 round of revisions (usually zero by month 2)',
  'Original research, including Reddit/G2/Capterra',
  'Internal linking and product-led framing',
  'Meta title, meta description, alt text, CTAs',
  'Product screenshots and GIFs where relevant',
  'Long-tail semantic keyword optimization for LLM search',
];

const WHATS_NOT = [
  'Design, illustration, or video production',
  'Publishing directly to your CMS (+$20 per post)',
  'Link building or outreach',
  'Ghostwriting for founders’ LinkedIn',
  'Whitepapers, eBooks, case studies (ask me to scope separately)',
  'Rush delivery under 2 business days ($700 per article)',
  'Keyword stuffing or AI-generated drafts',
];

const TESTIMONIALS = [
  {
    quote: <span>Peace specializes in product-led blog content, and it really shows in his work. He doesn&rsquo;t chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. <strong className="text-foreground font-semibold">His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</strong></span>,
    name: 'Regine Garcia',
    role: 'Head of Content',
    company: 'ManyRequests',
    initials: 'RG',
    photo: '/images/clients/regine-garcia.png',
  },
  {
    quote: <span>I&rsquo;m particularly impressed by his ability to follow briefs to a T, yet <strong className="text-foreground font-semibold">adapt and reorganize information on the fly</strong> based on what he knows about our ICP. He keeps to deadlines, and we never needed more than one round of feedback per article &mdash; and none towards the end of our project.</span>,
    name: 'Nathan Vander Heyden',
    role: 'Head of Marketing',
    company: 'Marker.io',
    initials: 'NV',
    photo: '/images/clients/nathan-vander-heyden.jpg',
  },
  {
    quote: <span>Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. <strong className="text-foreground font-semibold">He took feedback really fast and always came back stronger</strong> &mdash; the kind of person who makes your work easier just by being on the team.</span>,
    name: 'Lily Ugbaja',
    role: 'Head of Content',
    company: 'Spicy Margarita',
    initials: 'LU',
    photo: '/images/clients/lily-ugbaja.png',
  },
  {
    quote: <span>Peace does great work from the beginning of every assignment. He follows guidelines, is available and receptive to feedback, and implements edits swiftly and efficiently. <strong className="text-foreground font-semibold">Every article of his that I have been assigned to edit has been well-written and well-researched.</strong></span>,
    name: 'Crista Siglin',
    role: 'Editor',
    company: 'Pangea.ai',
    initials: 'CS',
    photo: '/images/clients/crista-siglin.png',
  },
];

const FAQS = [
  {
    q: 'Do you use AI to write your drafts?',
    a: 'No. I use AI as a research assistant and to automate part of my process — it helps me process research, gut-check structure, and move faster. The thinking, the opinions, the product depth, and the writing itself are mine.',
  },
  {
    q: 'How long does it take to get a finished article?',
    a: 'Usually 3–5 business days from brief to first draft. For retainer clients we agree on a fixed delivery cadence upfront that matches your publishing schedule.',
  },
  {
    q: 'What if the first draft misses the mark?',
    a: 'One round of revisions is included on every article. If it still doesn’t land, we work on it together until it does. I don’t ship drafts I’m not proud of, and I don’t leave clients stuck.',
  },
  {
    q: 'Can I cancel mid-bundle? What’s the notice period?',
    a: '14 days written notice to cancel or pause. No long contracts. Month-to-month, always.',
  },
  {
    q: 'How do you invoice?',
    a: 'Per article: 50% upfront, 50% on delivery. Bundle: 50% upfront, 50% on completion. Stripe or wire transfer. Net-15 terms after the first invoice.',
  },
  {
    q: 'What if you’re full when I want to start?',
    a: 'I cap at 4 active clients at a time. If I’m full, I’ll say so and give you a realistic timeline for the next opening. I won’t take a client I can’t properly serve.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes. Mutual NDA available before the discovery call if you need to share sensitive product or roadmap context.',
  },
  {
    q: 'What do you need from me to get started?',
    a: 'A brief or topic + target keyword, your ICP, and access to your product. If you can’t give me product access, I need access to someone on your team who knows the product well.',
  },
  {
    q: 'Do you write for early-stage startups?',
    a: 'Yes, with a caveat: early-stage works best when you have a clear ICP and at least one thing you know works for your product. If positioning is still unclear, I’ll flag that before we start — content can’t fix a messaging problem.',
  },
  {
    q: 'What makes a good fit for the bundle?',
    a: 'You need 3+ articles at a time, care about product-led content rather than just traffic, and want a writer who pushes back when something doesn’t make sense. If you just want execution without question, I’m probably not the right fit.',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero with price chips ───────────────────────── */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
          <div className="max-w-3xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] mb-5"
              style={{ color: 'var(--accent)' }}
            >
              B2B SaaS Content Writer
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 text-foreground"
              style={{ letterSpacing: '-0.03em' }}
            >
              Product-led BOFU articles for B2B SaaS companies publishing 4+ articles a month
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-4">
              I write articles that rank on Google, surface in LLM search, and naturally show your product solving real problems. No account managers, just you and me.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-10">
              I also build automations for the parts of the job that shouldn&rsquo;t need a human.
            </p>

            {/* Price chip row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl">
              <a href="#pricing" className="rounded-lg border border-border px-4 py-3 hover:border-accent/40 transition-colors" style={{ background: 'var(--muted)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'var(--accent)' }}>From</p>
                <p className="text-lg font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>$400/article</p>
                <p className="text-[11px] text-muted-foreground">Refresh</p>
              </a>
              <a href="#pricing" className="rounded-lg border border-border px-4 py-3 hover:border-accent/40 transition-colors" style={{ background: 'var(--muted)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'var(--accent)' }}>From</p>
                <p className="text-lg font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>$600/article</p>
                <p className="text-[11px] text-muted-foreground">Net new</p>
              </a>
              <a href="#pricing" className="rounded-lg border-2 border-accent/40 px-4 py-3 hover:border-accent transition-colors" style={{ background: 'var(--muted)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'var(--accent)' }}>Bundle</p>
                <p className="text-lg font-extrabold" style={{ letterSpacing: '-0.02em', color: 'var(--accent)' }}>$2,700</p>
                <p className="text-[11px] text-muted-foreground">5 articles &middot; save 10%</p>
              </a>
            </div>

            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-border text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Currently accepting 2 new clients
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#pricing"
                className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 text-center"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                See full pricing &rarr;
              </a>
              <Link
                href="/portfolio"
                className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md border border-border text-foreground transition-all hover:bg-muted text-center"
              >
                See the work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────── */}
      <section id="pricing" className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            What I offer
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-3 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            Three ways to work together
          </h2>
          <p className="text-sm text-muted-foreground mb-14 max-w-md leading-relaxed">
            Pick what fits where you are. Not sure? One article is always a good place to start.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {CONTENT_SERVICES.map((s) => (
              <div
                key={s.tag}
                className={`rounded-xl border p-7 flex flex-col transition-shadow hover:shadow-md ${
                  s.tag === '5-Article Bundle'
                    ? 'border-accent/40 ring-1 ring-accent/10'
                    : 'border-border'
                }`}
                style={{ background: s.tag === '5-Article Bundle' ? 'var(--muted)' : 'var(--background)' }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.12em] mb-5 block"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.tag}
                </span>
                {s.tag === '5-Article Bundle' && (
                  <span className="inline-flex items-center self-start rounded-full border border-accent/20 bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground mb-5">
                    Most common choice
                  </span>
                )}
                <p className="text-sm font-bold text-foreground mb-3">{s.name}</p>
                <p
                  className="text-3xl font-extrabold mb-1"
                  style={{ letterSpacing: '-0.03em', color: s.tag === '5-Article Bundle' ? 'var(--accent)' : 'var(--foreground)' }}
                >
                  {s.price}
                </p>
                <p className="text-xs text-muted-foreground mb-7">{s.priceNote}</p>
                <hr className="border-border mb-7" />
                <ul className="flex flex-col gap-3">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                        &rarr;
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── What's included / What's not ────────────── */}
          <div className="rounded-xl border border-border p-8 sm:p-10" style={{ background: 'var(--muted)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-6" style={{ color: 'var(--accent)' }}>
              What&rsquo;s included &middot; What&rsquo;s not
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-4 text-foreground">Included in every article</p>
                <ul className="flex flex-col gap-2.5">
                  {WHATS_INCLUDED.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: 'var(--accent)' }}>&rarr;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-4 text-foreground">Not included</p>
                <ul className="flex flex-col gap-2.5">
                  {WHATS_NOT.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0 font-bold text-muted-foreground/60">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof strip (post-price trust anchor) ────────── */}
      <section className="border-t border-border" style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14 sm:py-16">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-10 text-center"
            style={{ color: 'var(--accent)' }}
          >
            Heard from people who&rsquo;ve hired me
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <div className="rounded-xl border border-border bg-background p-7">
              <p
                className="text-sm leading-[1.85] text-foreground mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                &ldquo;He <strong className="font-semibold">adapts and reorganizes information on the fly</strong> based on what he knows about our ICP. We never needed more than one round of feedback per article &mdash; and none towards the end of our project.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/clients/nathan-vander-heyden.jpg"
                  alt="Nathan Vander Heyden"
                  width={36}
                  height={36}
                  className="flex-shrink-0 w-9 h-9 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">Nathan Vander Heyden</p>
                  <p className="text-xs text-muted-foreground">Head of Marketing &middot; Marker.io</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-7">
              <p
                className="text-sm leading-[1.85] text-foreground mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                &ldquo;<strong className="font-semibold">He took feedback really fast and always came back stronger</strong> &mdash; the kind of person who makes your work easier just by being on the team.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/clients/lily-ugbaja.png"
                  alt="Lily Ugbaja"
                  width={36}
                  height={36}
                  className="flex-shrink-0 w-9 h-9 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">Lily Ugbaja</p>
                  <p className="text-xs text-muted-foreground">Head of Content &middot; Spicy Margarita</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Is this you? ─────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            Is this you?
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-10 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            You might be the right fit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-border p-7 flex flex-col gap-5" style={{ background: 'var(--muted)' }}>
              <span className="text-3xl block">🫠</span>
              <div>
                <p className="text-sm font-bold mb-3" style={{ color: 'var(--accent)' }}>Head of Content</p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">
                  &ldquo;You&rsquo;re publishing regularly but the articles don&rsquo;t show your product. They&rsquo;re educational, sure. But they don&rsquo;t convert.&rdquo;
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-7 flex flex-col gap-5" style={{ background: 'var(--muted)' }}>
              <span className="text-3xl block">⏳</span>
              <div>
                <p className="text-sm font-bold mb-3" style={{ color: 'var(--accent)' }}>Founder / Growth Lead</p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">
                  &ldquo;You know content is the play. You just don&rsquo;t have time to brief a writer, review drafts, and still run the company.&rdquo;
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-7 flex flex-col gap-5" style={{ background: 'var(--muted)' }}>
              <span className="text-3xl block">😵‍💫</span>
              <div>
                <p className="text-sm font-bold mb-3" style={{ color: 'var(--accent)' }}>Content Manager with an AI problem</p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">
                  &ldquo;Your team is using AI to scale output. But the articles sound the same, and your editor is tired of fixing them.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Client logos ─────────────────────────────────── */}
      <section className="border-y border-border" style={{ background: 'var(--muted)' }}>
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

      {/* ── Case study ───────────────────────────────────── */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-4xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Case study
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-6 text-foreground leading-[1.2]"
              style={{ letterSpacing: '-0.02em' }}
            >
              ManyRequests: 43 product-led articles, including page-1 rankings against Workfront and the design crowd
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-6 max-w-3xl">
              ManyRequests is a B2B SaaS client portal for productized agencies. I&rsquo;ve written 43 articles for them over the past 20 months &mdash; 88% BOFU, each one threading the product through the piece so it&rsquo;s more helpful to the readers.
            </p>

            <figure className="mb-8 rounded-xl border border-border p-7" style={{ background: 'var(--muted)' }}>
              <blockquote className="text-base sm:text-lg leading-relaxed text-foreground mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                &ldquo;His top-performing posts are product-led ones, which has led to <strong className="font-semibold">more traffic and demo requests</strong> for ManyRequests.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/clients/regine-garcia.png"
                  alt="Regine Garcia"
                  width={36}
                  height={36}
                  className="flex-shrink-0 w-9 h-9 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">Regine Garcia</p>
                  <p className="text-xs text-muted-foreground">Head of Content &middot; ManyRequests</p>
                </div>
              </figcaption>
            </figure>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="rounded-xl border border-border p-6" style={{ background: 'var(--muted)' }}>
                <p className="text-3xl font-extrabold mb-1" style={{ letterSpacing: '-0.03em', color: 'var(--accent)' }}>43</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">Articles published for ManyRequests over 20 months · 88% BOFU</p>
              </div>
              <div className="rounded-xl border border-border p-6" style={{ background: 'var(--muted)' }}>
                <p className="text-3xl font-extrabold mb-1" style={{ letterSpacing: '-0.03em', color: 'var(--accent)' }}>#6</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">Google ranking for &ldquo;Workfront alternatives&rdquo; against the category leaders</p>
              </div>
              <div className="rounded-xl border border-border p-6" style={{ background: 'var(--muted)' }}>
                <p className="text-3xl font-extrabold mb-1" style={{ letterSpacing: '-0.03em', color: 'var(--accent)' }}>#6</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">Google ranking for &ldquo;design annotation tools&rdquo;</p>
              </div>
            </div>

            <Link
              href="/case-studies/manyrequests"
              className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              Read the full breakdown &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-5xl">
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
              style={{ letterSpacing: '-0.02em' }}
            >
              What clients say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="rounded-xl border border-border bg-background p-7 flex flex-col justify-between">
                  <p className="text-sm leading-[1.85] text-muted-foreground mb-7" style={{ fontFamily: 'var(--font-serif)' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.photo} alt={t.name} width={36} height={36} className="flex-shrink-0 w-9 h-9 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} &middot; {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/testimonials" className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4 transition-colors hover:opacity-70" style={{ color: 'var(--accent)' }}>
                See all testimonials &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            From brief to published
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', name: 'Discovery', desc: 'Short call or async brief to understand your product, audience, and goals.' },
              { step: '02', name: 'Research', desc: 'Competitor analysis, intent mapping, Business Potential Score check.' },
              { step: '03', name: 'Draft', desc: 'First draft delivered with internal links, product mentions, and optimized for organic and AI search.' },
              { step: '04', name: 'Publish-ready', desc: 'One round of revisions, usually fewer as we work together.' },
            ].map((s) => (
              <div key={s.step}>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--accent)' }}>{s.step}</p>
                <h3 className="text-[15px] font-bold text-foreground mb-2">{s.name}</h3>
                <p className="text-[13px] leading-[1.7] text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
              Questions I get a lot
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Everything you might want to know before we talk
            </h2>
            <div className="flex flex-col">
              {FAQS.map((item, i) => (
                <details key={i} className="group border-b border-border">
                  <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                    <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
                    <span className="flex-shrink-0 transition-transform group-open:rotate-45" style={{ color: 'var(--accent)' }}>+</span>
                  </summary>
                  <p className="text-[13px] leading-[1.8] text-muted-foreground pb-5">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Currently accepting 2 new clients
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Ready to hire a B2B SaaS content writer?
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-10 max-w-xl">
              Book a free 30-minute discovery call. No commitment, no pressure.
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
