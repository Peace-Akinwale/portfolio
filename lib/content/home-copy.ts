import type { PriceRow } from '@/components/PriceList';

// Selected website copy, 7 November 2026. Preserve Peace’s wording.
export const HERO = {
  "heading": "I write BOFU content for B2B SaaS companies & build AI marketing workflows.",
  "line": "I’m Peace Akinwale. I write articles that help buyers understand your product, and build workflows to automate marketing tasks.",
  "cta": "Book a 30-minute call"
};

export const WRITING = {
  "heading": "How I wrote 51 product-led articles for ManyRequests and made the product useful inside the piece",
  "p1": "I’ve written comparison content, buying guides and how to articles for ManyRequests since 2024, and I explain how the product works (or how it can be relevant to the reader based on their needs) in almost every single piece. This way, it becomes helpful to the reader and also helps them remember ManyRequests",
  "p2": "One comparison ranked third on Google for “design annotation tools”. Their operations and marketing lead said my product-led posts had “led to more traffic and demo requests”.",
  "shot": "/images/home/serp-design-annotation-results.png",
  "shotW": 685,
  "shotH": 430,
  "shotAlt": "Google results for “design annotation tools” in April 2026, with the ManyRequests article in third place, marked with an arrow",
  "links": [
    {
      "href": "/case-studies/manyrequests",
      "label": "Read the ManyRequests case study"
    },
    {
      "href": "/portfolio",
      "label": "Browse writing samples"
    }
  ]
};

export const BUILDING = {
  "heading": "Understand how AI answers connect buyers with products",
  "p1": "I designed a browser extension to record AI search activity, and I created a dashboard so the team can analyze each query and how it ties back to the client's product so they can further optimize their approach to AI visibility",
  "p2": "This way, strategists can inspect citations, mentions and collect data on why AI platforms choose their client's competitors.",
  "shot": "/case-studies/fanout-query-analysis-tool/fanout-01-one-run.png",
  "shotW": 1620,
  "shotH": 619,
  "shotAlt": "A captured AI answer in the fanout query analysis tool, with the brands named and the pages cited listed beside it. Client details are masked.",
  "links": [
    {
      "href": "/case-studies/fanout-query-analysis-tool",
      "label": "Read the fanout case study"
    }
  ]
};

export const AI_TOOLS = {
  "heading": "Know when an AI platform changes something your work depends on",
  "p1": "AI Docs Watch saves the before and after of documentation changes and explains what changed. You can see whether an update affects the features, policies or guidance your team relies on, then decide what needs a closer look in your own workflows.",
  "p2": "That gives you a way to keep your approach current without checking every documentation page yourself. The source sits beside the summary, so you can read the exact change before acting on it.",
  "shot": "/images/home/docswatch-google-before-after.png",
  "shotW": 1568,
  "shotH": 505,
  "shotAlt": "AI Docs Watch showing a Google documentation page before and after a change, side by side, with the changed passages marked.",
  "links": [
    {
      "href": "/case-studies/ai-docs-watch",
      "label": "Read the case study"
    }
  ],
  "site": "https://docswatch.stevetoth.ai"
};

export const THINKING = {
  "heading": "An idea is enough to start the conversation",
  "p1": "You might have a useful idea for your marketing team but no time to explore how it would work. Or you’ve tried a few tools and still have to do half the job yourself because none of them work the way you need them to.",
  "p2": "I can help you work out what to build, where AI would be useful, and how it would work with the systems you already use. You’ll have something your team can try and help shape, with room to make adjustments based on how they actually use it.",
  "shot": "/case-studies/okf/okf-demo-desktop.png",
  "shotW": 1440,
  "shotH": 1000,
  "shotAlt": "Demo of Peace’s writing knowledge base, with an answer and supporting notes",
  "links": [
    {
      "href": "/case-studies",
      "label": "See what I’ve built"
    },
    {
      "href": "/contact",
      "label": "Tell me about your idea"
    }
  ]
};

const PRICE_ROWS: PriceRow[] = [
  {
    "name": "Article refresh",
    "price": "$400 USD",
    "unit": "2,000–2,500 words"
  },
  {
    "name": "New article",
    "price": "$600 USD",
    "unit": "2,000–3,000 words"
  },
  {
    "name": "Five new articles per month",
    "price": "$2,700 USD/month"
  }
];

export const OFFER = {
  writing: "Product comparisons, alternatives pages and buying guides that explain how your software helps your prospects do their jobs.",
  building: "Let's talk about what you've always wanted to automate or an idea you haven't developed yet because you don't have the time. I can help diagnose what you need and recommend an angle that can help you save time and take credits for innovative solutions to optimizing for AI search or improving your internal processes.",
  priceRows: PRICE_ROWS,
  prices: PRICE_ROWS.map((r) => r.unit ? r.name + ', ' + r.price + ' (' + r.unit + ')' : r.name + ', ' + r.price),
  workflowRow: { name: 'AI workflows', price: 'Custom pricing' } as PriceRow,
};

export const CONTENTDB = {
  // brief
  p1: 'I built ContentDB to help writers use the expertise already sitting in a company’s content. It brings existing articles and videos into a searchable library that connects to an AI tool through MCP.',
  p2: 'When you need an expert insight for a new article, you ask your AI tool to find it in that library. You don’t have to dig through old studies and ebooks yourself.',
  caseStudy: '/case-studies/contentdb',
};



export const GARDE = {
  // brief. This paragraph belongs to Garde, never to Aloud.
  p1: 'A few friends liked it, but I couldn\'t find a way to go viral and reach more people. I also found that there were many free, faster alternatives. After four months of building and spending out of pocket, I stopped paying for cloud resources and shut it down. I wrote about that decision.',
  lead: 'Garde turned recipe videos into text so you could cook without rewinding.',
  essay: '/blog/what-i-learned-vibe-coding-my-first-app-shutting-it-down',
};
