import { withOg } from '@/lib/og';
import { JsonLdScript } from '@/components/JsonLdScript';
import { serviceJsonLd } from '@/lib/seo/jsonld';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CALENDLY_URL, EMAIL, SITE_URL } from '@/lib/site';
import { OFFER } from '@/lib/content/home-copy';
import { PriceList } from '@/components/PriceList';

export const metadata: Metadata = withOg({
  title: 'Writing and AI workflow services for B2B SaaS teams',
  description:
    'Bottom-of-funnel articles for B2B SaaS companies and agencies, priced per article or per month. AI workflows for content teams, scoped depending on what your team needs.',
  alternates: { canonical: `${SITE_URL}/services` },
}, { key: 'services', path: '/services', alt: 'Writing and AI workflows for B2B SaaS content teams' });

const SERVICE_COPY = OFFER.writing;
const TOOL_CTA = OFFER.building;
const PRICE_ROWS = OFFER.priceRows;

const WHATS_INCLUDED = [
  '2,000 to 3,000 words per article',
  'One round of revisions, which most clients stop needing by month two',
  'Buyer research from Reddit and review sites like G2 and Capterra',
  'Internal linking and product-led framing',
  'Meta title and meta description',
  'Alt text and CTAs',
  'Product screenshots and GIFs where relevant',
  'Phrasing an AI search tool can quote when it answers a buyer',
];

const EXTRAS = [
  { name: 'Publishing to your CMS', price: '$20', unit: 'per post' },
  { name: 'Rush delivery', price: '$700', unit: 'per article, under 2 business days' },
];

const WHATS_NOT = [
  'Design or video production',
  'Link building or outreach',
  'Ghostwriting for founders’ LinkedIn',
  'Whitepapers and case studies (ask me to scope them as their own project)',
];

// The six questions a buyer asks before a call (4 Nov 2026; the earlier
// thirteen are in git history). Facts are Peace's, 3 Nov 2026.
const FAQS = [
  { q: 'What if the first draft misses the mark?', a: 'One round of revisions is included on every article. It covers anything the brief asked for that the draft missed, and the wording changes your editor wants. A new angle or a new topic after the draft is a new piece, and I’ll tell you before I start it.' },
  { q: 'How long does an article take?', a: '3 to 5 business days from brief to first draft. For agencies, 4 to 6 articles a month at 48 to 72 hours each, from your brief and your client’s product, in your editor’s house style.' },
  { q: 'How do you invoice, and can I cancel?', a: 'Per article, 50% upfront and 50% on delivery. For a bundle, 50% upfront and 50% on completion. Stripe or wire transfer, net-15 after the first invoice. 14 days’ written notice to cancel or pause, month to month.' },
  { q: 'What do you need from me to get started?', a: 'Access to your product, and a brief or a topic with a target keyword. Tell me who the reader is too. If you can’t give me product access, I need someone on your team who knows the product.' },
  { q: 'Do you sign NDAs?', a: 'Yes. A mutual NDA is available before the discovery call if you need to share product or roadmap context.' },
  { q: 'What happens after you hand over a workflow?', a: 'You own the code and the accounts it runs on, and the hosting bill is yours. I size it before we start and tell you the monthly cost. After launch I stay on a retainer for a few weeks and fix the problems your team finds in daily use. After that, ongoing support is a separate arrangement we agree on.' },
];

const CLIENTS = ['ManyRequests', 'Exceed SEO', 'Jabra', 'Marker.io', 'HigherVisibility', 'Pangea.ai', 'Spicy Margarita'];

// Structured data built from the same price rows the page shows, so the two
// cannot drift. FAQPage is left out: Google retired the FAQ rich result in May 2026.
const SERVICE_LD = serviceJsonLd({
  name: 'B2B SaaS content writing',
  description: SERVICE_COPY,
  url: '/services',
  offers: PRICE_ROWS.map((r) => ({ name: r.name, price: Number(r.price.replace(/[^0-9]/g, '')), currency: 'USD' })),
});

export default function ServicesPage() {
  return (
    <>
      <JsonLdScript data={SERVICE_LD} />
      <section className="gutter mx-auto max-w-[1180px] py-12 md:py-16">
        <h1 className="max-w-[20ch]">Articles for B2B SaaS buyers, and AI workflows for the team that writes for them.</h1>
        <p className="mt-5 max-w-[60ch] text-[1.2rem] leading-[1.45]">{SERVICE_COPY}</p>
        <p className="mt-3 max-w-[64ch] text-[15.5px] text-muted-foreground">
          I’ve worked with {CLIENTS.slice(0, -1).join(', ')} and {CLIENTS[CLIENTS.length - 1]}.
        </p>
      </section>

      <section className="offer svc-offer" id="prices" aria-labelledby="writing-h">
        <div className="border-t border-border">
          <h2 id="writing-h">Writing</h2>
          <p>I research every article from your product and your customers’ own words, and I check it against its sources before you see it.</p>
          <PriceList rows={PRICE_ROWS} label="Writing prices" />
          <p className="note">Prices in US dollars. Three or more new articles at once also get 10% off.</p>
          <p className="note">I also consult on SEO and AEO (answer engine optimization) strategy. I review how AI search tools find and cite your content, and I help you decide which topics to write next. Scoped per engagement.</p>
          <p className="offer-actions">
            <a className="button button-ink" href={CALENDLY_URL} rel="noopener" target="_blank">Book a 30-minute call</a>
            <a className="button button-line" href={`mailto:${EMAIL}?subject=An%20article`}>Email about an article</a>
          </p>
          <figure className="svc-proof">
            <Image src="/images/home/serp-design-annotation-results.png" width={685} height={430} loading="lazy" sizes="(max-width: 760px) 100vw, 520px" alt="Google results for “design annotation tools” in April 2026, with the ManyRequests article in third place, marked with an arrow" />
            <figcaption><Link href="/case-studies/manyrequests">The ManyRequests case study</Link></figcaption>
          </figure>
        </div>
        <div className="border-t border-border" id="building">
          <h2>AI workflows</h2>
          <p>{TOOL_CTA}</p>
          <PriceList rows={[OFFER.workflowRow]} label="AI workflow pricing" />
          <p className="note">I write the requirements and decide the architecture. Then I build the workflow and set its security rules, directing coding agents through the work. I keep a decisions file for every workflow, and nothing is called done until a real person has used it on the live app.</p>
          <p className="offer-actions">
            <a className="button button-ink" href={CALENDLY_URL} rel="noopener" target="_blank">Book a 30-minute call</a>
            <Link className="button button-line" href="/contact">Describe the task</Link>
          </p>
          <figure className="svc-proof">
            <Image src="/case-studies/fanout-query-analysis-tool/fanout-01-one-run.png" width={1620} height={619} loading="lazy" sizes="(max-width: 760px) 100vw, 520px" alt="A captured AI answer in the fanout query analysis tool, with the brands named and the pages cited listed beside it. Client details are masked." />
            <figcaption><Link href="/case-studies/fanout-query-analysis-tool">The fanout query analysis tool case study</Link></figcaption>
          </figure>
        </div>
      </section>

      <section id="includes" className="gutter mx-auto max-w-[1180px] grid gap-10 border-t border-border py-12 md:grid-cols-2" aria-label="What an article includes">
        <div>
          <h2 className="text-[1.5rem]">What every article includes</h2>
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
          <div className="mt-4">
            <PriceList rows={EXTRAS} label="Optional extras" />
          </div>
          <h2 className="mt-10 text-[1.5rem]">Not included</h2>
          <ul className="mt-4 list-disc pl-5 text-[16px] leading-relaxed text-muted-foreground">
            {WHATS_NOT.map((i) => <li key={i} className="mb-1.5">{i}</li>)}
          </ul>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[1180px] border-t border-border py-12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-[1.75rem]">Before you book</h2>
        <dl className="mt-6 grid gap-x-12 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="border-t border-border py-5">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-[1.02rem] leading-[1.5]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="gutter mx-auto max-w-[1180px] border-t border-border py-12" aria-label="Next step">
        <h2 className="text-[1.75rem]">Next step</h2>
        <p className="mt-3 max-w-[56ch] text-[1.1rem]">Email me the topic or the task, or book a 30-minute call. You’ll hear back within a business day. If I’m not the right person for it, I’ll say so.</p>
        <p className="mt-4 offer-actions">
          <a href={CALENDLY_URL} rel="noopener" target="_blank" className="button button-ink">Book a 30-minute call</a>
          <a href={`mailto:${EMAIL}`} className="button button-line">Email me</a>
        </p>
      </section>
    </>
  );
}
