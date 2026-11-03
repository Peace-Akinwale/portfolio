import { withOg } from '@/lib/og';
import { JsonLdScript } from '@/components/JsonLdScript';
import { serviceJsonLd } from '@/lib/seo/jsonld';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CALENDLY_URL, EMAIL, SITE_URL } from '@/lib/site';
import { OFFER } from '@/lib/content/home-copy';

export const metadata: Metadata = withOg({
  title: 'Writing and AI tool services for B2B SaaS teams',
  description:
    'Bottom-of-funnel articles for B2B SaaS companies and agencies, priced per article or per month. Tool building for content teams, scoped around the work your team repeats every week.',
  alternates: { canonical: `${SITE_URL}/services` },
}, { key: 'services', path: '/services', alt: 'Writing with me, and building with me' });

const SERVICE_COPY = OFFER.writing;
const TOOL_CTA = OFFER.building;
const PRICES = OFFER.prices;

const WHATS_INCLUDED = [
  '2,000 to 3,000 words per article',
  'One round of revisions, which most clients stop needing by month two',
  'Original research from Reddit and review sites like G2 and Capterra',
  'Internal linking and product-led framing',
  'Meta title and meta description',
  'Alt text and CTAs',
  'Product screenshots and GIFs where relevant',
  'Phrasing an AI search tool can quote when it answers a buyer',
];

const EXTRAS = [
  'Publishing to your CMS, $20 per post',
  'Rush delivery under 2 business days, $700 per article',
];

const WHATS_NOT = [
  'Design or video production',
  'Link building or outreach',
  'Ghostwriting for founders’ LinkedIn',
  'Whitepapers and case studies (ask me to scope them as their own project)',
  'Keyword stuffing or AI-generated drafts',
];

const FAQS = [
  { q: 'Do you use AI to write your drafts?', a: 'No. The opinions and the writing are mine. I use AI as a research assistant and to automate steps in my process, like sorting research and gut-checking structure.' },
  { q: 'How long does it take to get a finished article?', a: '3 to 5 business days from brief to first draft for most articles. For retainer clients we agree on a fixed delivery cadence upfront that matches your publishing schedule.' },
  { q: 'What if the first draft misses the mark?', a: 'One round of revisions is included on every article. It covers anything the brief asked for that the draft missed, and the wording changes your editor wants. A new angle or a new topic after the draft is a new piece, and I’ll tell you before I start it.' },
  { q: 'Can I cancel mid-bundle? What’s the notice period?', a: '14 days written notice to cancel or pause. No long contracts. Month-to-month, always.' },
  { q: 'How do you invoice?', a: 'Per article, 50% upfront and 50% on delivery. For a bundle, 50% upfront and 50% on completion. Stripe or wire transfer. Net-15 terms after the first invoice.' },
  { q: 'What if you’re full when I want to start?', a: 'I cap at 4 active clients at a time. If I’m full, I’ll say so and give you a realistic timeline for the next opening. I won’t take a client I don’t have the time to serve.' },
  { q: 'Do you sign NDAs?', a: 'Yes. Mutual NDA available before the discovery call if you need to share sensitive product or roadmap context.' },
  { q: 'What do you need from me to get started?', a: 'Access to your product and a brief or topic with a target keyword. I also need to know your ICP. If you can’t give me product access, I need access to someone on your team who knows the product.' },
  { q: 'Do you write for early-stage startups?', a: 'Yes, with a caveat. Early-stage works best when you have a clear ICP and at least one thing you know works for your product. If positioning is unclear, I’ll flag that before we start. Content can’t fix a messaging problem.' },
  { q: 'What happens after you hand over a tool?', a: 'You own the code and the accounts it runs on, and the hosting bill is yours. I size it before we start and tell you the monthly cost. I stay on for the first month to fix anything that breaks. After that, ongoing support is a separate arrangement we agree on.' },
  { q: 'What about building a tool?', a: 'Tell me about the task first. Some tasks don’t need software, and I’ll say so. If a tool would help, we scope it together around how the team already works. I make the build decisions and log them in a decisions file, and nothing is called done until it passes a live check.' },
];

const CLIENTS = ['ManyRequests', 'Exceed SEO', 'Jabra', 'Marker.io', 'HigherVisibility', 'Pangea.ai', 'Spicy Margarita'];

// Structured data built from the same price lines the page shows, so the two
// cannot drift. FAQPage is left out: Google retired the FAQ rich result in May 2026.
function priceOf(line: string): number | null {
  const m = line.match(/\$([\d,]+)/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
}
const SERVICE_LD = serviceJsonLd({
  name: 'B2B SaaS content writing',
  description: SERVICE_COPY,
  url: '/services',
  offers: PRICES.flatMap((line) => {
    const price = priceOf(line);
    return price === null ? [] : [{ name: line.split(',')[0], price, currency: 'USD' }];
  }),
});

export default function ServicesPage() {
  return (
    <>
      <JsonLdScript data={SERVICE_LD} />
      <section className="gutter mx-auto max-w-[1180px] py-12 md:py-16">
        <h1 className="max-w-[18ch]">Writing with me, and building with me.</h1>
        <p className="serif mt-5 max-w-[60ch] text-[1.2rem] leading-[1.45]">{SERVICE_COPY}</p>
        <p className="mt-3 max-w-[60ch] text-[15px] text-muted-foreground">
          Here’s who I’ve written for. {CLIENTS.slice(0, -1).join(', ')} and {CLIENTS[CLIENTS.length - 1]}. The articles are on the <Link href="/portfolio#writing" className="underline underline-offset-4">writing page</Link>, the ManyRequests work is a <Link href="/case-studies/manyrequests" className="underline underline-offset-4">case study</Link>, and the tools are under <Link href="/case-studies" className="underline underline-offset-4">case studies</Link>.
        </p>
      </section>

      <section className="offer" id="prices" aria-labelledby="writing-h">
        <div className="border-t border-border">
          <h2 id="writing-h">Writing</h2>
          <p>I research every article from your product and your customers’ own words, and I check it against its sources before you see it.</p>
          <ul>
            {PRICES.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="note">Prices in US dollars. Five articles a month saves 10% against the per-article price. Three or more new articles at once also get 10% off.</p>
          <a className="button button-ink" href={`mailto:${EMAIL}?subject=An%20article`}>Email about an article</a>
          <a className="button button-line" href={CALENDLY_URL} rel="noopener" target="_blank">Book a 30-minute call</a>
        </div>
        <div className="border-t border-border bg-[var(--accent-wash)]" id="building">
          <h2 id="building">Building</h2>
          <p>{TOOL_CTA}</p>
          <p className="note">Scoped per project after we’ve talked about the task. I write the requirements and decide the architecture. Then I build the tool and set its security rules, directing coding agents through the work.</p>
          <p className="note">Every tool I build keeps a decisions file, and nothing is called done until a real person has used it on the live app. The case studies show what that looks like.</p>
          <Link className="button button-accent" href="/contact">Tell me about the task</Link>
          <Link className="button button-line" href="/case-studies">See what I’ve built</Link>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[1180px] grid gap-10 border-t border-border py-12 md:grid-cols-2" aria-label="What an article includes">
        <div>
          <h2 className="text-[1.5rem]">What you get with every article</h2>
          <ul className="mt-4 list-disc pl-5 text-[16px] leading-relaxed">
            {WHATS_INCLUDED.map((i) => (
              <li key={i} className="mb-1.5">
                {i}
                {i.startsWith('Phrasing an AI search tool') && <> (<Link href="/how-to-optimize-for-aeo" className="underline underline-offset-4">how I approach AEO</Link>)</>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[1.5rem]">Optional extras</h2>
          <ul className="mt-4 list-disc pl-5 text-[16px] leading-relaxed">
            {EXTRAS.map((i) => <li key={i} className="mb-1.5">{i}</li>)}
          </ul>
          <h2 className="mt-10 text-[1.5rem]">What’s not included</h2>
          <ul className="mt-4 list-disc pl-5 text-[16px] leading-relaxed text-muted-foreground">
            {WHATS_NOT.map((i) => <li key={i} className="mb-1.5">{i}</li>)}
          </ul>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[1180px] border-t border-border py-12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-[1.75rem]">Questions I get asked</h2>
        <dl className="mt-6 grid gap-x-12 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="border-t border-border py-5">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="serif mt-2 text-[1.05rem] leading-[1.5]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="gutter mx-auto max-w-[1180px] border-t border-border py-12" aria-label="Next step">
        <h2 className="text-[1.75rem]">So, what’s next?</h2>
        <p className="serif mt-3 max-w-[56ch] text-[1.1rem]">Email me the topic or the task, or grab a 30-minute call. You’ll hear back within a business day. And if I’m not the right person for it, I’ll tell you.</p>
        <p className="mt-4">
          <Link href="/contact" className="button button-ink">Contact</Link>
          <a href={CALENDLY_URL} rel="noopener" target="_blank" className="button button-line ml-3">Book a call</a>
        </p>
      </section>
    </>
  );
}
