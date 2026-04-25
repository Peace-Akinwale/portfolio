/**
 * Draft — not indexed until placeholders filled and Peace approves.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { getFaviconUrl } from '@/lib/ogImage';

export const metadata: Metadata = {
  title: 'Case Study: ManyRequests | Peace Akinwale',
  description:
    'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://peaceakinwale.com/case-studies/manyrequests',
  },
  openGraph: {
    title: 'Case Study: ManyRequests — 44 product-led articles, page-1 rankings',
    description:
      'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece.',
    url: 'https://peaceakinwale.com/case-studies/manyrequests',
    siteName: 'Peace Akinwale',
    type: 'article',
    images: [
      {
        url: 'https://peaceakinwale.com/images/case-studies/manyrequests/manyrequests-homepage.png',
        width: 1512,
        height: 793,
        alt: 'ManyRequests — The Client Portal Built For Agencies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Study: ManyRequests — 44 product-led articles, page-1 rankings',
    description:
      'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece.',
    images: ['https://peaceakinwale.com/images/case-studies/manyrequests/manyrequests-homepage.png'],
  },
};

const MR_FAVICON = getFaviconUrl('manyrequests.com', 32);

export default function ManyRequestsCaseStudyPage() {
  return (
    <>
      {/* ── Draft banner ────────────────────────────────── */}
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-300 dark:border-yellow-800">
        <div className="max-w-7xl mx-auto px-6 py-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-yellow-900 dark:text-yellow-100">
          Draft &middot; case study &middot; not indexed
        </div>
      </div>

      {/* ── Breadcrumb ──────────────────────────────────── */}
      <div className="bg-background border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link
            href="/case-studies"
            className="text-xs text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1.5"
          >
            &larr; Case Studies
          </Link>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 pt-16 sm:pt-24 pb-12">
          <div className="flex items-center gap-3 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MR_FAVICON} alt="" width={24} height={24} className="rounded" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              ManyRequests &middot; B2B SaaS &middot; Client portal software
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent)' }}>
            Case study
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 text-foreground"
            style={{ letterSpacing: '-0.03em' }}
          >
            How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>By Peace Akinwale</span>
            <span aria-hidden>&middot;</span>
            <span>April 25, 2026</span>
            <span aria-hidden>&middot;</span>
            <span>8 min read</span>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div className="rounded-xl border border-border p-5" style={{ background: 'var(--muted)' }}>
              <p className="text-3xl font-extrabold mb-1" style={{ letterSpacing: '-0.03em', color: 'var(--accent)' }}>44</p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">Articles published</p>
            </div>
            <div className="rounded-xl border border-border p-5" style={{ background: 'var(--muted)' }}>
              <p className="text-3xl font-extrabold mb-1" style={{ letterSpacing: '-0.03em', color: 'var(--accent)' }}>22</p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">High-fit topics where the product could be shown directly</p>
            </div>
            <div className="rounded-xl border border-border p-5" style={{ background: 'var(--muted)' }}>
              <p className="text-sm font-extrabold mb-1 text-foreground leading-snug">Page one</p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">For &ldquo;Workfront alternatives&rdquo; and &ldquo;design annotation tools&rdquo;</p>
            </div>
            <div className="rounded-xl border border-border p-5" style={{ background: 'var(--muted)' }}>
              <p className="text-sm font-extrabold mb-1 text-foreground leading-snug">Active</p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">Retainer still running</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product visual ──────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/case-studies/manyrequests/manyrequests-homepage.png"
            alt="ManyRequests homepage — the client portal built for agencies"
            className="w-full rounded-xl border border-border"
            loading="lazy"
          />
        </div>
      </section>

      {/* ── Overview ────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent)' }}>
            Overview
          </p>
          <p className="text-base leading-[1.85] text-foreground mb-5">
            <a href="https://www.manyrequests.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>ManyRequests</a> did not need more blog posts that mentioned the product once near the end and called that product-led content. They needed articles that could rank for the right searches, answer the reader properly, and show where the product fit while the reader was still making up their mind.
          </p>
          <p className="text-base leading-[1.85] text-muted-foreground mb-5">
            I&rsquo;ve written 44 articles for ManyRequests over roughly 20 months. Most of them sit close to the bottom of the funnel. Comparison pages, alternatives pages, workflow guides, and operational topics where agency owners are already trying to decide what tool to use or how to run a cleaner system.
          </p>
          <p className="text-base leading-[1.85] text-muted-foreground mb-5">
            The goal was simple. Make the article useful enough to earn trust, then make the product feel like a logical next step inside the article itself.
          </p>
          <p className="text-base leading-[1.85] text-muted-foreground mb-10">
            That approach worked. According to Regine Garcia, Head of Content at ManyRequests, the product-led posts led to more traffic and demo requests.
          </p>

          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-4 text-muted-foreground">Results at a glance</p>
          <ul className="flex flex-col gap-3 mb-10">
            {[
              '44 published articles across BOFU and product-adjacent agency operations topics',
              '22 high-fit topics where the product could be explained and shown directly in the body',
              'Page one rankings for searches like "Workfront alternatives," "ClickUp vs Notion," and "design annotation tools" at the time of review',
              'Retainer still active',
            ].map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.7] text-muted-foreground">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                {r}
              </li>
            ))}
          </ul>

          {/* Product demo video */}
          <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/jYtpAL8aPyE?si=2YFGZwcHvBzKUZ2f"
              title="ManyRequests product demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── The Challenge ───────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent)' }}>
            The challenge
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            A crowded category where the easy version of this work is familiar
          </h2>
          <p className="text-base leading-[1.85] text-muted-foreground mb-5">
            ManyRequests sells client portal and agency management software for creative agencies and productized service businesses. That puts them in a crowded search space. They are competing with generic <a href="https://manyrequests.com/blog/client-facing-project-management-tool" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>project management tools</a>, alternatives sites, affiliate roundups, and bigger software brands with more authority.
          </p>
          <p className="text-base leading-[1.85] text-muted-foreground mb-5">
            The easy version of this work is familiar. Pick a comparison keyword, write a listicle, add the client&rsquo;s logo at the top, mention the product in the conclusion, and move on. That kind of article can rank for a while, but it usually does a weak job of helping the reader understand why this product matters and how it helps.
          </p>
          <p className="text-base leading-[1.85] text-muted-foreground">
            ManyRequests needed something better. The brief was not just to publish content. It was to write articles where the product could do real work inside the body of the piece.
          </p>
        </div>
      </section>

      {/* ── How I approached the work ───────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent)' }}>
            How I approached the work
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Three things I did consistently across 44 articles
          </h2>

          {/* Step 1 */}
          <div className="mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--accent)' }}>Step 01</p>
            <h3 className="text-xl font-extrabold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              I chose topics where I could explain how the product works inside the article
            </h3>
            <p className="text-base leading-[1.85] text-muted-foreground mb-4">
              Before I wrote anything, I looked at each topic through a simple question: can I show the reader where ManyRequests fits before the article is over?
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground mb-4">
              If the answer was yes, the topic scored higher (using the <a href="https://blog.timsoulo.com/business-potential-the-most-important-metric-in-content-marketing/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>business potential score</a>). If the fit was weak, I either changed the angle or treated the piece as broader educational content instead of trying to force the product into it.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground mb-4">
              That is what pushed the work toward topics like <a href="https://manyrequests.com/blog/workfront-alternatives" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>Workfront alternatives</a>, <a href="https://www.manyrequests.com/blog/clickup-alternatives" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>ClickUp alternatives</a>, <a href="https://manyrequests.com/blog/client-facing-project-management-tool" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>client-facing project management tool</a>, <a href="https://manyrequests.com/blog/retainer-management-software" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>retainer management software</a>, and <a href="https://manyrequests.com/blog/design-annotation-software" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>design annotation tools</a>. In those searches, the reader is already comparing tools or trying to solve an operational problem that ManyRequests actually helps with.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground mb-8">
              That filter also helped on broader topics like <a href="https://www.manyrequests.com/blog/agency-retainer-model" target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-80 transition-all" style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent)' }}>agency retainer model</a>. It kept me honest. If the product could not help explain the workflow, I had no reason to wedge it into the piece.
            </p>

            {/* Figure 2 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/case-studies/manyrequests/manyrequests-business-potential-score.png"
              alt="Business potential score spreadsheet showing topic fit ratings for ManyRequests articles"
              className="w-full rounded-xl border border-border"
              loading="lazy"
            />
          </div>

          {/* Step 2 */}
          <div className="mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--accent)' }}>Step 02</p>
            <h3 className="text-xl font-extrabold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              I showed the product through workflows, screenshots, and customer proof
            </h3>
            <p className="text-base leading-[1.85] text-muted-foreground mb-4">
              Once a topic passed that first filter, I tried to make the product useful inside the article. Not visible. Useful.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground mb-6">
              That usually meant three things:
            </p>

            <ul className="flex flex-col gap-2.5 mb-8">
              {[
                'Explain the workflow, not just the feature',
                'Show the product where a screenshot helps the reader understand the step',
                'Use customer examples where proof matters more than marketing copy',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.7] text-muted-foreground">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-base leading-[1.85] text-muted-foreground mb-6">
              You can see that pattern clearly in the work.
            </p>

            {/* Wrike vs ClickUp */}
            <div className="rounded-xl border border-border p-6 mb-4" style={{ background: 'var(--muted)' }}>
              <a href="https://www.manyrequests.com/blog/wrike-vs-clickup" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground mb-3 underline underline-offset-2 hover:opacity-70 transition-opacity block">Wrike vs ClickUp &rarr;</a>
              <p className="text-[15px] leading-[1.75] text-muted-foreground mb-5">
                The reader is not just comparing task management tools. They are often trying to figure out what works for an agency that has to manage clients, approvals, billing, and delivery in one place. That gave me room to explain why a client portal, proofing, and white-label delivery matter in the first place, and where ManyRequests fits better than another internal PM tool.
              </p>
              {/* Figure 3 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/case-studies/manyrequests/wrike-vs-clickup-product.png"
                alt="ManyRequests product shown inside the Wrike vs ClickUp article"
                className="w-full rounded-lg border border-border"
                loading="lazy"
              />
            </div>

            {/* Agency Retainer Model */}
            <div className="rounded-xl border border-border p-6 mb-4" style={{ background: 'var(--muted)' }}>
              <a href="https://www.manyrequests.com/blog/agency-retainer-model" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground mb-3 underline underline-offset-2 hover:opacity-70 transition-opacity block">Agency Retainer Model &rarr;</a>
              <p className="text-[15px] leading-[1.75] text-muted-foreground mb-5">
                The product fit is less obvious at first, which is why I like it as proof. The article is teaching the reader how to structure and run a retainer. That gave me a practical place to show add-on services, intake forms, and cleaner request handling inside ManyRequests. The product was not tacked on. It was part of the operational advice.
              </p>
              {/* Figure 4 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/case-studies/manyrequests/agency-retainer-model-product.png"
                alt="ManyRequests product shown inside the Agency Retainer Model article"
                className="w-full rounded-lg border border-border"
                loading="lazy"
              />
            </div>

            {/* Design Annotation Tools */}
            <div className="rounded-xl border border-border p-6" style={{ background: 'var(--muted)' }}>
              <a href="https://www.manyrequests.com/blog/design-annotation-software" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground mb-3 underline underline-offset-2 hover:opacity-70 transition-opacity block">Design Annotation Tools &rarr;</a>
              <p className="text-[15px] leading-[1.75] text-muted-foreground mb-5">
                The fit is direct. The feature is the topic. That article let me explain the dashboard, markup flow, and video feedback with screenshots and concrete use cases instead of generic feature copy.
              </p>
              {/* Figure 5 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/case-studies/manyrequests/design-annotation-tools-product.png"
                alt="ManyRequests product shown inside the Design Annotation Tools article"
                className="w-full rounded-lg border border-border"
                loading="lazy"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--accent)' }}>Step 03</p>
            <h3 className="text-xl font-extrabold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              I wrote each article to answer the next question a buyer would ask
            </h3>
            <p className="text-base leading-[1.85] text-muted-foreground mb-4">
              Search intent gets someone into the article. It does not finish the job.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground mb-4">
              A reader searching &ldquo;Workfront alternatives&rdquo; is also wondering whether the alternative works for agencies, whether clients can submit requests cleanly, whether the team can manage billing, whether feedback stays organized, and whether the whole thing still works once the agency grows.
            </p>
            <p className="text-base leading-[1.85] text-muted-foreground">
              So I wrote the body to answer those follow-up questions inside the piece. That is part of what made the work feel product-led without turning it into a sales page. The product showed up where the reader naturally needed an answer, not where the brand wanted one more mention.
            </p>
          </div>
        </div>
      </section>

      {/* ── What this looked like in the work ───────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent)' }}>
            What this looked like in the work
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Three articles that explain the whole approach
          </h2>
          <ul className="flex flex-col gap-5">
            {[
              {
                title: 'Wrike vs ClickUp',
                desc: 'Shows how I handle hard comparison content. The article meets the search intent, but it also reframes the decision around what agencies actually need, not just what a general PM buyer might want.',
              },
              {
                title: 'Agency Retainer Model',
                desc: 'Shows how I handle broader educational queries. The topic is not an alternatives page. The product has to earn its place through the workflow.',
              },
              {
                title: 'Design Annotation Tools',
                desc: "Shows the clearest version of the method. The product belongs in the article from the start, and the screenshots make that obvious.",
              },
            ].map((item, i) => (
              <li key={i} className="rounded-xl border border-border p-6" style={{ background: 'var(--muted)' }}>
                <p className="text-sm font-bold text-foreground mb-2">{item.title}</p>
                <p className="text-[14px] leading-[1.75] text-muted-foreground">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent)' }}>
            The results
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            What the work produced
          </h2>
          <p className="text-base leading-[1.85] text-muted-foreground mb-8">
            This work produced a large body of published content for ManyRequests and helped strengthen the bottom of their funnel around commercial and product-adjacent searches.
          </p>

          <ul className="flex flex-col gap-3 mb-10">
            {[
              '44 published articles across comparisons, alternatives, workflow guides, and agency operations topics',
              'Strong concentration around high-intent searches where ManyRequests had real product fit',
              'Page one visibility for "Workfront alternatives" and "design annotation tools" during review',
              'Ongoing retainer — which usually tells you as much as any vanity metric',
            ].map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.75] text-muted-foreground">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                {r}
              </li>
            ))}
          </ul>

          <figure className="mb-10 rounded-xl border border-border p-7" style={{ background: 'var(--muted)' }}>
            <blockquote
              className="text-base sm:text-lg leading-relaxed text-foreground mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              &ldquo;Peace specializes in product-led blog content, and it really shows in his work. He doesn&rsquo;t chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. <strong className="font-semibold">His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</strong>&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/clients/regine-garcia.png"
                alt="Regine Garcia"
                width={40}
                height={40}
                className="flex-shrink-0 w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-foreground">Regine Garcia</p>
                <p className="text-xs text-muted-foreground">Head of Content &middot; ManyRequests</p>
              </div>
            </figcaption>
          </figure>

          {/* Figure 6 */}
          <div className="rounded-xl border border-dashed border-border p-6 text-center" style={{ background: 'var(--muted)' }}>
            <p className="text-xs font-bold text-muted-foreground mb-1">Figure 6 — SERP or Search Console proof</p>
            <p className="text-[11px] text-muted-foreground/60">Add later if available — Search Console or SERP screenshot for rankings</p>
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
          <p className="text-base leading-[1.85] text-foreground mb-5">
            What worked here was not just volume. It was product judgment.
          </p>
          <p className="text-base leading-[1.85] text-muted-foreground">
            The articles did not treat ManyRequests like a logo to attach at the end of a post. They used the product to help explain the problem, the workflow, and the decision the reader was already trying to make. That is what made the content more useful, and more commercial, at the same time.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Want articles like these for your product?
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-10 max-w-xl">
            If your blog publishes regularly but the product never really shows up in the work, that&rsquo;s usually where I start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/services"
              className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 text-center"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              See services &rarr;
            </Link>
            <a
              href="https://calendly.com/akindayopeaceakinwale/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md border border-border text-foreground transition-all hover:bg-muted text-center"
            >
              Book a discovery call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
