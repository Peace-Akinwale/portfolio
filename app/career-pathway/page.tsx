// app/career-pathway/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Pathway Assessment | Peace Akinwale',
  description:
    'Answer honest questions. Get 4 real career recommendations matched to your situation — backed by WEF, BLS, and LinkedIn data.',
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
        Scoring informed by WEF Future of Jobs 2025, BLS Occupational Outlook, LinkedIn Jobs on the Rise,
        McKinsey AI displacement research, and Stack Overflow Developer Survey 2024/2025.
      </p>
    </div>
  );
}
