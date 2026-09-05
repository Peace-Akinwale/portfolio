import type { ReactNode } from 'react';

const em = (text: string) => <strong className="font-semibold text-foreground">{text}</strong>;

export type Service = {
  id: string;
  tag: string;
  name: string;
  price: string;
  priceNote: string;
  featured?: boolean;
  features: ReactNode[];
};

export const SERVICES: Service[] = [
  {
    id: 'refresh',
    tag: 'Content refresh',
    name: 'Refresh one article',
    price: '$400',
    priceNote: 'per article, 2,000 to 2,500 words',
    features: [
      'Refreshing is most times better than publishing new content.',
      'I look at gaps in your competitors’ content and write to meet the new search intent.',
      <>
        I weave your product into the article without forcing it, so the reader leaves knowing {em('what you do')} and{' '}
        {em('when they might need you')}.
      </>,
      'I swap out old product images, add GIFs, and update alt texts and CTAs where relevant.',
      'I optimize for organic and AI search engines to improve visibility.',
    ],
  },
  {
    id: 'bundle',
    tag: '5-article bundle',
    name: 'Product-led articles that move readers',
    price: '$2,700',
    priceNote: '5 articles, save 10%, flexible scope',
    featured: true,
    features: [
      'Well-written, product-led articles that move readers to make a decision about your product.',
      'Flexible scope. Need a sixth or seventh article? Easy to add at the discounted rate.',
      'You work directly with me. No account managers, rotating writers, or starting from scratch every brief.',
      <>
        If a draft misses the mark, {em('we work on it together')} until it reads better, usually with two rounds of
        feedback when we are just starting out.
      </>,
      'Automation or editorial systems work available as an add-on.',
    ],
  },
  {
    id: 'new',
    tag: 'Net new article',
    name: 'One article, done right',
    price: '$600',
    priceNote: 'per article, 2,000 to 3,000 words, bundle 3+ for 10% off',
    features: [
      'I evaluate whether we can talk about your product in the article without forcing it, even on a TOFU blog post.',
      'I use your product and read help docs so I understand where it fits in the assigned topics and how it differs from competitors’.',
      'I optimize for organic and AI search engines and write to meet search intent.',
      'I think beyond the brief. Every article has a job to do, and I write to that outcome.',
    ],
  },
];

export const WHATS_INCLUDED = [
  '2,000 to 3,000 words per article',
  '1 round of revisions (usually zero by month 2)',
  'Original research, including Reddit, G2 and Capterra',
  'Internal linking and product-led framing',
  'Meta title, meta description, alt text, CTAs',
  'Product screenshots and GIFs where relevant',
  'Long-tail semantic keyword optimization for LLM search',
];

export const WHATS_NOT = [
  'Design, illustration, or video production',
  'Publishing directly to your CMS (+$20 per post)',
  'Link building or outreach',
  'Ghostwriting for founders’ LinkedIn',
  'Whitepapers, eBooks, case studies (ask me to scope separately)',
  'Rush delivery under 2 business days ($700 per article)',
  'Keyword stuffing or AI-generated drafts',
];

export const PROCESS = [
  { step: '01', name: 'Discovery', desc: 'Short call or async brief to understand your product, audience, and goals.' },
  { step: '02', name: 'Research', desc: 'Competitor analysis, intent mapping, Business Potential Score check.' },
  { step: '03', name: 'Draft', desc: 'First draft delivered with internal links, product mentions, and optimized for organic and AI search.' },
  { step: '04', name: 'Publish-ready', desc: 'One round of revisions, usually fewer as we work together.' },
];

export const FAQS = [
  {
    q: 'Do you use AI to write your drafts?',
    a: 'No. I use AI as a research assistant and to automate part of my process. It helps me process research, gut-check structure, and move faster. The thinking, the opinions, the product depth, and the writing itself are mine.',
  },
  {
    q: 'How long does it take to get a finished article?',
    a: 'Usually 3 to 5 business days from brief to first draft. For retainer clients we agree on a fixed delivery cadence upfront that matches your publishing schedule.',
  },
  {
    q: 'What if the first draft misses the mark?',
    a: 'One round of revisions is included on every article. If it still does not land, we work on it together until it does. I do not ship drafts I am not proud of, and I do not leave clients stuck.',
  },
  {
    q: 'Can I cancel mid-bundle? What is the notice period?',
    a: '14 days written notice to cancel or pause. No long contracts. Month-to-month, always.',
  },
  {
    q: 'How do you invoice?',
    a: 'Per article: 50% upfront, 50% on delivery. Bundle: 50% upfront, 50% on completion. Stripe or wire transfer. Net-15 terms after the first invoice.',
  },
  {
    q: 'What if you are full when I want to start?',
    a: 'I cap at 4 active clients at a time. If I am full, I will say so and give you a realistic timeline for the next opening. I will not take a client I cannot properly serve.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes. Mutual NDA available before the discovery call if you need to share sensitive product or roadmap context.',
  },
  {
    q: 'What do you need from me to get started?',
    a: 'A brief or topic plus target keyword, your ICP, and access to your product. If you cannot give me product access, I need access to someone on your team who knows the product well.',
  },
  {
    q: 'Do you write for early-stage startups?',
    a: 'Yes, with a caveat: early-stage works best when you have a clear ICP and at least one thing you know works for your product. If positioning is still unclear, I will flag that before we start. Content cannot fix a messaging problem.',
  },
  {
    q: 'What makes a good fit for the bundle?',
    a: 'You need 3+ articles at a time, care about product-led content rather than just traffic, and want a writer who pushes back when something does not make sense. If you just want execution without question, I am probably not the right fit.',
  },
];
