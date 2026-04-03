// app/career-pathway/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Assessment Tool | Peace Akinwale',
  description:
    'Figure out the career you\'re the best fit for so you can move from uncertainty to clarity, and then from clarity to action.',
  alternates: {
    canonical: 'https://peaceakinwale.com/career-pathway',
  },
  openGraph: {
    title: 'Career Assessment Tool',
    description:
      'Figure out the career you\'re the best fit for so you can move from uncertainty to clarity, and then from clarity to action.',
    url: 'https://peaceakinwale.com/career-pathway',
    siteName: 'Peace Akinwale',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Assessment Tool',
    description:
      'Figure out the career you\'re the best fit for so you can move from uncertainty to clarity, and then from clarity to action.',
  },
};

export default function CareerPathwayLanding() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <div className="flex flex-col gap-4">
        <p
          className="text-xs font-bold uppercase tracking-[0.15em]"
          style={{ color: 'var(--accent)' }}
        >
          Free · No login · 5 minutes
        </p>
        <h1
          className="text-3xl sm:text-5xl font-extrabold text-foreground leading-[1.05]"
          style={{ letterSpacing: '-0.03em' }}
        >
          Figure out the career you&apos;re the best fit for.
        </h1>
      </div>

      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
        Answer honest questions, and get four real career recommendations matched to your situation — your time, your budget, your goals, and what the job market actually looks like in 2026 and beyond.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Link
          href="/career-pathway/assessment"
          className="inline-block px-8 py-4 rounded-md text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          Start the Assessment →
        </Link>
      </div>

      {/* What it does / doesn't */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">What it does</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed">
            <li>✓ 17–18 click-only questions</li>
            <li>✓ Scores 23 careers against your answers</li>
            <li>✓ Returns 4 personalised matches with resources to get started</li>
            <li>✓ Honest about time, cost, and AI impact</li>
          </ul>
        </div>
        <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">What it doesn&apos;t do</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed">
            <li>✗ Generic &quot;follow your passion&quot; advice</li>
            <li>✗ Guaranteed outcomes</li>
            <li>✗ Assume you have a degree or savings</li>
            <li>✗ Pretend every path is equally accessible</li>
            <li>✗ Ignore the reality of AI in these careers</li>
          </ul>
        </div>
      </div>

      {/* Data source note */}
      <p className="text-xs text-muted-foreground">
        Scoring informed by{' '}
        <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-accent hover:text-accent/80 transition-colors">WEF Future of Jobs 2025</a>,{' '}
        <a href="https://www.bls.gov/ooh/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-accent hover:text-accent/80 transition-colors">BLS Occupational Outlook</a>,{' '}
        <a href="https://www.linkedin.com/pulse/linkedin-jobs-rise-2025-25-fastest-growing-roles-us-linkedin-news/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-accent hover:text-accent/80 transition-colors">LinkedIn Jobs on the Rise</a>,{' '}
        <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-accent hover:text-accent/80 transition-colors">McKinsey AI displacement research</a>, and{' '}
        <a href="https://survey.stackoverflow.co/2024/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-accent hover:text-accent/80 transition-colors">Stack Overflow Developer Survey 2024/2025</a>.
      </p>
    </div>
  );
}
