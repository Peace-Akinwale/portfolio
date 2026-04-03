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

/* ─── Static data ────────────────────────────────────────── */

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
    priceNote: 'per article \u00B7 2,000\u20132,500 words',
    features: [
      'Refreshing is most times better than publishing new content.',
      "I look at gaps in your competitors' content and write to meet the \u2018new\u2019 search intent.",
      <span key="f3">I weave your product into the article without forcing it, so the reader leaves knowing <strong className="text-foreground font-semibold">what you do</strong> and <strong className="text-foreground font-semibold">when they might need you</strong>.</span>,
      'I swap out old product images, add GIFs, and update alt texts and CTAs where relevant.',
      'I optimize for organic and AI search engines to improve visibility.',
    ],
  },
  {
    tag: 'Net New Article',
    name: 'One article, done right',
    price: '$600\u2013700',
    priceNote: 'per article \u00B7 2,000\u20133,000 words',
    featured: true,
    features: [
      'I evaluate whether we can talk about your product in the article without forcing it, even on a TOFU blog post.',
      'I use your product and read help docs so I understand where it fits in the assigned topics and how it differs from competitors\u2019.',
      'I optimize for organic and AI search engines and write to meet search intent.',
      'I think beyond the brief \u2014 every article has a job to do, and I write to that outcome.',
    ],
  },
  {
    tag: 'Monthly Retainer',
    name: '5\u00D7 BOFU, product-led articles',
    price: '$3,000',
    priceNote: 'per month \u00B7 5 articles',
    features: [
      'Every piece is product-led and optimized for organic and AI search.',
      'BOFU-first content: comparisons, alternatives, and how-to articles where your product is the answer. I also write TOFU content and include product features where relevant.',
      'You work directly with me. No account managers, rotating writers, or starting from scratch every time you send a brief.',
      'Workflow automation consulting available as an add-on.',
    ],
  },
];

const ALL_SERVICES = [
  ...CONTENT_SERVICES,
  {
    tag: 'AI Systems',
    name: 'Custom system for your team',
    price: '$1,500\u20135,000',
    priceNote: 'per project \u00B7 scope-dependent',
    features: [
      <span key="f1">I&rsquo;ve built a <a href="https://contentdb.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors" style={{ color: 'var(--accent)' }}>ContentDB</a>: a database where you save your team&rsquo;s high-value content and query it through Claude via MCP. Anytime you&rsquo;re writing an article, you can pull context directly from the database to improve the credibility of the piece, without manually reading eBooks or listening to podcast sessions for talking points.</span>,
      <span key="f2">I&rsquo;ve helped a team build a <a href="https://peaceakinwale.com/linkedin-router" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors" style={{ color: 'var(--accent)' }}>LinkedIn Router</a> that turns a founder&rsquo;s rough ideas into polished posts. They write the rough idea in Notion, add context through podcast links, and click approve. The router generates a brief, an editor reviews and approves it, and the post is written using brand guidelines that make the final draft sound exactly like the founder.</span>,
      'I look for what slows your workflow down and what we can realistically automate.',
      'Built by a writer who thinks in systems, not a developer who learned to write.',
    ],
    cta: true,
  },
];

const TESTIMONIALS = [
  {
    quote: <span>Peace specializes in product-led blog content, and it really shows in his work. He doesn&rsquo;t chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. <strong className="text-foreground font-semibold">His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</strong></span>,
    name: 'Regine Garcia',
    role: 'Head of Content',
    company: 'ManyRequests',
    domain: 'manyrequests.com',
    initials: 'RG',
    photo: '/images/clients/regine-garcia.png',
  },
  {
    quote: <span>I&rsquo;m particularly impressed by his ability to follow briefs to a T, yet <strong className="text-foreground font-semibold">adapt and reorganize information on the fly</strong> based on what he knows about our ICP. He keeps to deadlines, and we never needed more than one round of feedback per article &mdash; and none towards the end of our project.</span>,
    name: 'Nathan Vander Heyden',
    role: 'Head of Marketing',
    company: 'Marker.io',
    domain: 'marker.io',
    initials: 'NV',
    photo: '/images/clients/nathan-vander-heyden.jpg',
  },
  {
    quote: <span>Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. <strong className="text-foreground font-semibold">He took feedback really fast and always came back stronger</strong> &mdash; the kind of person who makes your work easier just by being on the team.</span>,
    name: 'Lily Ugbaja',
    role: 'Head of Content',
    company: 'Spicy Margarita',
    domain: 'spicymargarita.co',
    initials: 'LU',
    photo: '/images/clients/lily-ugbaja.png',
  },
  {
    quote: <span>Peace does great work from the beginning of every assignment. He follows guidelines, is available and receptive to feedback, and implements edits swiftly and efficiently. <strong className="text-foreground font-semibold">Every article of his that I have been assigned to edit has been well-written and well-researched.</strong></span>,
    name: 'Crista Siglin',
    role: 'Editor',
    company: 'Pangea.ai',
    domain: 'pangea.ai',
    initials: 'CS',
    photo: '/images/clients/crista-siglin.png',
  },
  {
    quote: <span>Akinwale is an excellent writer with a keen eye for details. He worked with me at Onigege Ara for about 2 years, where he executed many content writing and copywriting projects with great success. <strong className="text-foreground font-semibold">He is loyal, dedicated, and has an impressive work ethic.</strong> He is a great addition to any writing team.</span>,
    name: 'Olumide Akinlaja',
    role: 'Founder',
    company: 'Onigege Ara',
    domain: null,
    initials: 'OA',
    photo: '/images/clients/olumide-akinlaja.jpg',
  },
];

/* ─── Page ───────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
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
            Product-led content for B2B&nbsp;SaaS
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mb-4">
            If you need a B2B SaaS content writer, I write in a way that naturally shows your product in action and improves your chances of ranking in Google and showing up in LLM search.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mb-10">
            I also build lightweight automations to take the manual work off your plate so you can focus on higher-stakes decisions.
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-border text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Currently accepting 2 new clients
          </span>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/portfolio"
              className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 text-center"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              See the work &rarr;
            </Link>
            <Link
              href="/contact"
              className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md border border-border text-foreground transition-all hover:bg-muted text-center"
            >
              Get in touch
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* ── Is This You? ───────────────────────────────── */}
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
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 text-foreground">What I do</p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">
                  I weave your product into every article naturally so readers understand what it does, who it&rsquo;s for, and why it matters without feeling like they&rsquo;re reading a sales page.
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
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 text-foreground">What I do</p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">
                  For every topic, I assess whether it&rsquo;s a real opportunity, where it fits in your customer&rsquo;s journey, and the content gaps in existing pages. You get a writer who thinks about the strategy beyond the brief.
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
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 text-foreground">What I do</p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground mb-3">
                  I comb through Reddit, G2, Capterra, thought leadership content on LinkedIn, blogs, and listen to relevant podcasts as part of my research process, and what those leaders say actually makes it into the piece.
                </p>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">
                  I also read good newsletters and wickedly good writers to keep my editorial judgment sharp, so my writing doesn&rsquo;t pick up the flat, generic patterns in AI-generated content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services / Pricing ─────────────────────────── */}
      <section className="bg-background">
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
            Four ways to work together
          </h2>
          <p className="text-sm text-muted-foreground mb-14 max-w-md leading-relaxed">
            Pick what fits where you are right now. If you&rsquo;re not sure, one article is always a good place to start.
          </p>

          {/* ── Content cards: 3-col ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {CONTENT_SERVICES.map((s) => (
              <div
                key={s.tag}
                className={`rounded-xl border p-7 flex flex-col transition-shadow hover:shadow-md ${
                  s.tag === 'Monthly Retainer'
                    ? 'border-accent/40 ring-1 ring-accent/10 md:order-2'
                    : s.tag === 'Net New Article'
                      ? 'border-border md:order-3'
                      : 'border-border md:order-1'
                }`}
                style={{ background: s.tag === 'Monthly Retainer' ? 'var(--muted)' : 'var(--background)' }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.12em] mb-5 block"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.tag}
                </span>
                {s.tag === 'Monthly Retainer' && (
                  <span className="inline-flex items-center self-start rounded-full border border-accent/20 bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground mb-5">
                    Most common choice
                  </span>
                )}
                <p className="text-sm font-bold text-foreground mb-3">{s.name}</p>
                <p
                  className="text-3xl font-extrabold mb-1"
                  style={{ letterSpacing: '-0.03em', color: s.tag === 'Monthly Retainer' ? 'var(--accent)' : 'var(--foreground)' }}
                >
                  {s.price}
                </p>
                <p className="text-xs text-muted-foreground mb-7">{s.priceNote}</p>
                <hr className="border-border mb-7" />
                <ul className="flex flex-col gap-3">
                  {s.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
                    >
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

          {/* ── AI Systems: full-width card ── */}
          <div
            className="rounded-xl border border-border p-8 sm:p-10 transition-shadow hover:shadow-md"
            style={{ background: 'var(--background)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_auto] gap-8 md:gap-10 items-start">
              {/* Left: tag, name, price */}
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.12em] mb-5 block"
                  style={{ color: 'var(--accent)' }}
                >
                  AI Systems
                </span>
                <p className="text-sm font-bold text-foreground mb-3">Custom system for your team</p>
                <p
                  className="text-3xl font-extrabold text-foreground mb-1"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  $1,500&ndash;5,000
                </p>
                <p className="text-xs text-muted-foreground mb-6">per project &middot; scope-dependent</p>
                <Link
                  href="/contact"
                  className="inline-block px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 text-center"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  Let&rsquo;s scope it &rarr;
                </Link>
              </div>

              {/* Right: features in 2-col sub-grid */}
              <div className="md:col-span-2">
                <hr className="border-border mb-7 md:hidden" />
                <ul className="grid grid-cols-1 gap-y-4">
                  {ALL_SERVICES[3].features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                        &rarr;
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
                  See live examples on my{' '}
                  <Link href="/projects" className="underline underline-offset-2 transition-colors" style={{ color: 'var(--accent)' }}>
                    projects page
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who I write for ───────────────────────────── */}
      <section className="border-t border-border" style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-10"
            style={{ color: 'var(--accent)' }}
          >
            Who I write for
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-7">
            {[
              { label: 'MarTech', sub: 'Marketing & analytics software' },
              { label: 'Project Management Software', sub: 'Work management & agency ops' },
              { label: 'DevTools & QA Software', sub: 'Developer tools & testing platforms' },
              { label: 'Collaboration Software', sub: 'Workplace & unified communications' },
              { label: 'Workflow Automation', sub: 'Workflow automation tools' },
              { label: 'HR Tech & Talent Platforms', sub: 'Hiring, workforce & talent marketplaces' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-sm font-bold text-foreground leading-snug mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client logos ───────────────────────────────── */}
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
                  <img
                    src={c.favicon}
                    alt=""
                    width={18}
                    height={18}
                    className="rounded"
                    loading="lazy"
                  />
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

      {/* ── Pull quote ─────────────────────────────────── */}
      <section style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-base sm:text-lg leading-relaxed text-foreground mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            &ldquo;His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">
            Regine Garcia &middot; Head of Content, ManyRequests
          </p>
          </div>
        </div>
      </section>

      {/* ── Results strip ──────────────────────────────── */}
      <section className="border-t border-border" style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p
                className="text-4xl font-extrabold mb-2"
                style={{ letterSpacing: '-0.04em', color: 'var(--accent)' }}
              >
                233%
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">Organic traffic growth for HigherVisibility</p>
            </div>
            <div>
              <p
                className="text-4xl font-extrabold mb-2"
                style={{ letterSpacing: '-0.04em', color: 'var(--accent)' }}
              >
                6+
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">B2B SaaS brands published at</p>
            </div>
            <div>
              <p
                className="text-4xl font-extrabold mb-2"
                style={{ letterSpacing: '-0.04em', color: 'var(--accent)' }}
              >
                1 round
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">Average revisions per article (often zero toward end of engagements)</p>
            </div>
            <div>
              <p
                className="inline-block text-xs font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full mb-3"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Cited in LLM search engines
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">My clients get mentioned in ChatGPT, Perplexity, and Google AI Overviews for relevant queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nathan pull quote ──────────────────────────── */}
      <section style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-base sm:text-lg leading-relaxed text-foreground mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            &ldquo;We never needed more than one round of feedback per article &mdash; and none towards the end of our project.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">
            Nathan Vander Heyden &middot; Head of Marketing, Marker.io
          </p>
          </div>
        </div>
      </section>

      {/* ── How I think (scannable boxes) ─────────────── */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-4xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            How I think
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            How I think about content
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="rounded-xl border border-border p-7" style={{ background: 'var(--muted)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--accent)' }}>01</p>
              <h3 className="text-[15px] font-bold text-foreground mb-2 leading-snug">
                &ldquo;Will we be able to talk about the product here, without forcing it?&rdquo;
              </h3>
              <p className="text-[13px] leading-[1.7] text-muted-foreground">
                The first question I ask before writing anything.
                If the answer is no, I&rsquo;ll say so. This is the <a href="https://databox.com/customers-and-revenue-ahrefs" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>Business Potential Score</a>, a framework Tim Soulo at Ahrefs advocates for, and it should be the first filter in every editorial calendar.
              </p>
            </div>

            <div className="rounded-xl border border-border p-7" style={{ background: 'var(--muted)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--accent)' }}>02</p>
              <h3 className="text-[15px] font-bold text-foreground mb-2 leading-snug">
                Do a few things right, and it bangs.
              </h3>
              <p className="text-[13px] leading-[1.7] text-muted-foreground">
                Most companies don&rsquo;t need more content. They need fewer, better pieces &mdash;
                and to refresh what&rsquo;s already ranking before publishing new.
                Refreshing is most times better than publishing at scale.
              </p>
            </div>

            <div className="rounded-xl border border-border p-7" style={{ background: 'var(--muted)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--accent)' }}>03</p>
              <h3 className="text-[15px] font-bold text-foreground mb-2 leading-snug">
                Good GEO is good SEO.
              </h3>
              <p className="text-[13px] leading-[1.7] text-muted-foreground">
                I optimize for LLM recommendations the same way I optimize for Google &mdash;
                with thorough semantic structure, real product depth, and specificity.
                I don&rsquo;t treat them as separate problems.
              </p>
            </div>

            <div className="rounded-xl border border-border p-7" style={{ background: 'var(--muted)' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--accent)' }}>04</p>
              <h3 className="text-[15px] font-bold text-foreground mb-2 leading-snug">
                I try to understand the &lsquo;why&rsquo; before I write.
              </h3>
              <p className="text-[13px] leading-[1.7] text-muted-foreground">
                I push back on topics, on the intent behind a brief, and on strategies
                I think are targeting the wrong thing. Once I understand why something matters
                to the customer journey, the work gets significantly better.
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
            On AI workflows: <strong className="text-foreground font-semibold">AI-powered editorial workflows are insanely important</strong> &mdash;
            they&rsquo;re how I make sure a piece is as specific and resonant as it needs to be.
            What AI doesn&rsquo;t do is write articles for me.
          </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-5xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            What clients say
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            From the people who hired me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`rounded-xl border border-border bg-background p-7 flex flex-col justify-between${
                  i === TESTIMONIALS.length - 1 && TESTIMONIALS.length % 2 !== 0
                    ? ' md:col-span-2'
                    : ''
                }`}
              >
                <p
                  className="text-sm leading-[1.85] text-muted-foreground mb-7"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {t.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={t.photo}
                      alt={t.name}
                      width={36}
                      height={36}
                      className="flex-shrink-0 w-9 h-9 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold bg-muted text-muted-foreground">
                      {t.initials}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} &middot; {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/testimonials"
              className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4 transition-colors hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              See all testimonials &rarr;
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            How it works
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-14 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            From brief to published
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                name: 'Discovery',
                desc: 'Short call or async brief to understand your product, audience, and goals.',
              },
              {
                step: '02',
                name: 'Research',
                desc: <span>Competitor analysis, intent mapping, <a href="https://databox.com/customers-and-revenue-ahrefs" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>Business Potential Score</a> check.</span>,
              },
              {
                step: '03',
                name: 'Draft',
                desc: 'First draft delivered with internal links, product mentions, and optimized for organic and AI search.',
              },
              {
                step: '04',
                name: 'Publish-ready',
                desc: 'One round of revisions, usually fewer as we work together.',
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.step}
                </p>
                <h3 className="text-[15px] font-bold text-foreground mb-2">{s.name}</h3>
                <p className="text-[13px] leading-[1.7] text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
          <h2
            className="text-lg sm:text-xl font-extrabold mb-10 text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            FAQs about me
          </h2>
          <div className="flex flex-col">
            {[
              {
                q: 'Do you use AI to write your draft?',
                a: 'No, I don\u2019t. I use AI as a research assistant and to automate part of my process. It helps me process research, gut-check my structure, tweak poor sentences, and move faster. The thinking, the opinions, the product depth, and the actual writing are mine.',
              },
              {
                q: 'How long does it take to get a finished article?',
                a: 'Usually 3\u20135 business days from when I get the brief to when I submit the first draft. For retainer clients, we\u2019ll agree on a fixed delivery cadence upfront that makes sense for your publishing schedule.',
              },
              {
                q: 'What do you need from me to get started?',
                a: 'A brief or a topic and target keyword, your ICP, and access to your tool. If that\u2019s not provided, I need access to someone on your team who knows the product well. I\u2019ll do the rest. You can also provide a fully structured outline, but I can create one and circle back to you.',
              },
              {
                q: 'Do you write for early-stage startups?',
                a: 'Yes, but with a caveat: early-stage works best when you have a clear ICP and at least one thing you know works for your product. If you\u2019re still figuring out positioning, I\u2019ll flag that before we start. Content won\u2019t fix a messaging problem.',
              },
              {
                q: 'Can you help with topic strategy, not just writing?',
                a: 'Yes. Topic strategy is part of the retainer by default. I\u2019ll look at what you\u2019re already ranking for, where you have gaps, and which topics actually give your product a reason to show up. I\u2019ll push back on anything I think is targeting the wrong intent.',
              },
              {
                q: 'What makes a good fit for the retainer?',
                a: 'You\u2019re publishing at least 4\u20136 articles a month (or want to), you care about product-led content, not just traffic, and you want a writer who pushes back when something doesn\u2019t make sense. If you need someone who just executes briefs without question, I\u2019m probably not the right fit.',
              },
            ].map((item, i) => (
              <details key={i} className="group border-b border-border">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                  <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
                  <span className="flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-45" style={{ color: 'var(--accent)' }}>
                    +
                  </span>
                </summary>
                <p className="text-[13px] leading-[1.8] text-muted-foreground pb-5">{item.a}</p>
              </details>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
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
