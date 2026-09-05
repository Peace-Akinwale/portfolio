export type System = {
  name: string;
  what: string;
  stack: string;
  year: string;
  href?: string;
};

/** Tools built for the writing work. Proof of thinking in systems, not a second service. */
export const SYSTEMS: System[] = [
  {
    name: 'MyLinks',
    what: 'Crawls a site, understands the content inventory, and suggests precise internal links for any draft, then applies them in Google Docs.',
    stack: 'Next.js, Supabase, OpenAI embeddings',
    year: '2026',
    href: '/projects/mylinks',
  },
  {
    name: 'ContentDB',
    what: 'Turns research and customer conversations into searchable, source-grounded answers, available in web chat and in Claude, ChatGPT and Gemini through MCP.',
    stack: 'Supabase, MCP, Next.js',
    year: '2026',
    href: '/projects/contentdb',
  },
  {
    name: 'This site',
    what: 'An editorial portfolio and blog built and redesigned with Claude Code. The same process builds calculators and tools on a client’s site.',
    stack: 'Next.js 16, Tailwind v4, WordPress API',
    year: '2025 to 2026',
    href: '/projects',
  },
];
