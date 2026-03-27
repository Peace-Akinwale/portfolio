import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Submission View | Career Pathway' };

const CAREER_TITLES: Record<string, string> = {
  'frontend-dev': 'Frontend Developer',
  'backend-dev': 'Backend Developer',
  'fullstack-dev': 'Fullstack Developer',
  'mobile-dev': 'Mobile Developer',
  'it-support': 'IT Support Specialist',
  'qa-engineer': 'QA Engineer',
  'cybersecurity': 'Cybersecurity Analyst',
  'devops-cloud': 'DevOps / Cloud Engineer',
  'data-analyst': 'Data Analyst',
  'data-engineer': 'Data Engineer',
  'ui-ux-designer': 'UI/UX Designer',
  'product-designer': 'Product Designer',
  'graphic-designer': 'Graphic Designer',
  'product-manager': 'Product Manager',
  'project-manager': 'Project Manager',
  'b2b-saas-writer': 'B2B SaaS Content Writer',
  'technical-writer': 'Technical Writer',
  'seo-strategist': 'SEO Strategist',
  'social-media-manager': 'Social Media Manager',
  'video-editor': 'Video Editor',
  'digital-marketer': 'Digital Marketing Specialist',
  'email-marketer': 'Email Marketing Specialist',
  'ai-workflow': 'AI Workflow Specialist',
};

const rankLabel = ['Best Fit', 'Strong Alternate', 'Worth Exploring', 'Worth Exploring'];

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('career_pathway_responses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) notFound();

  const results: { careerId: string; score: number; rank: number }[] = data.results ?? [];
  const answers: Record<string, string | string[]> = data.answers ?? {};
  const submittedAt = new Date(data.created_at).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--accent)' }}>
          Career Pathway — Submission View
        </p>
        <h1 className="text-2xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
          {data.name || 'Anonymous'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {data.email || 'No email'} · {data.country || '—'} · {data.age_range || '—'} · {submittedAt}
        </p>
        {data.discovery_source && (
          <p className="text-xs text-muted-foreground">Found via: {data.discovery_source}</p>
        )}
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Top Matches</h2>
        {results
          .sort((a, b) => a.rank - b.rank)
          .map((r) => (
            <div
              key={r.careerId}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
              style={{
                borderColor: r.rank === 1 ? 'var(--accent)' : 'var(--border)',
                background: r.rank === 1 ? 'color-mix(in srgb, var(--accent) 6%, var(--background))' : 'var(--background)',
              }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  {rankLabel[r.rank - 1]}
                </span>
                <span className="font-semibold text-sm mt-0.5">
                  {CAREER_TITLES[r.careerId] ?? r.careerId}
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                {r.score} pts
              </span>
            </div>
          ))}
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Their Answers</h2>
        <div className="rounded-lg border p-4 flex flex-col gap-2 text-sm" style={{ borderColor: 'var(--border)' }}>
          {Object.entries(answers).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="font-semibold shrink-0 text-muted-foreground w-10">{key}</span>
              <span>{Array.isArray(val) ? val.join(', ') : val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
