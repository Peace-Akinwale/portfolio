import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { buildTranscriptSections } from '@/lib/career-pathway/transcript';
import type { Answers, CareerResultSummary } from '@/lib/career-pathway/types';

export const metadata: Metadata = {
  title: 'Submission View | Career Pathway',
  robots: {
    index: false,
    follow: false,
  },
};

const CAREER_TITLES: Record<string, string> = {
  'frontend-dev': 'Frontend Developer',
  'backend-dev': 'Backend Developer',
  'fullstack-dev': 'Full-Stack Developer',
  'mobile-dev': 'Mobile Developer',
  'it-support': 'IT Support Specialist',
  'qa-engineer': 'QA / Test Engineer',
  cybersecurity: 'Cybersecurity Analyst',
  'devops-cloud': 'DevOps / Cloud Engineer',
  'data-analyst': 'Data Analyst',
  'data-engineer': 'Data Engineer',
  'ui-ux-designer': 'UI/UX Designer',
  'product-designer': 'Product Designer',
  'graphic-designer': 'Graphic Designer',
  'product-manager': 'Product Manager',
  'project-manager': 'Project Manager (Digital/Tech)',
  'b2b-saas-writer': 'B2B SaaS Content Writer',
  'technical-writer': 'Technical Writer',
  'seo-strategist': 'SEO Strategist',
  'social-media-manager': 'Social Media Manager / Strategist',
  'video-editor': 'Video Editor',
  'digital-marketer': 'Digital Marketing Specialist',
  'email-marketer': 'Email Marketing Specialist',
  'ai-workflow': 'AI Workflow Specialist / AI Operations',
};

const RANK_LABEL = ['Best Fit', 'Best Alternative', 'Worth Exploring', 'Worth Exploring'] as const;

function ResultsBlock({ title, results }: { title: string; results: CareerResultSummary[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
      {results
        .sort((a, b) => a.rank - b.rank)
        .map((result) => (
          <div
            key={`${title}-${result.rank}-${result.careerId}`}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
            style={{
              borderColor: result.rank === 1 ? 'var(--accent)' : 'var(--border)',
              background:
                result.rank === 1
                  ? 'color-mix(in srgb, var(--accent) 6%, var(--background))'
                  : 'var(--background)',
            }}
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                {RANK_LABEL[result.rank - 1]}
              </span>
              <span className="mt-0.5 text-sm font-semibold">
                {CAREER_TITLES[result.careerId] ?? result.careerId}
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
              {result.score} pts
            </span>
          </div>
        ))}
    </div>
  );
}

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

  const results = (data.results ?? []) as CareerResultSummary[];
  const moatResults = (data.moat_results ?? []) as CareerResultSummary[];
  const baseResults = (data.base_results ?? []) as CareerResultSummary[];
  const answers = (data.answers ?? {}) as Answers;
  const refinementTriggered = Boolean(data.refinement_triggered);
  const refinementAnswers = (data.refinement_answers ?? {}) as Answers;
  const transcriptAnswers = { ...answers, ...refinementAnswers };
  const transcriptSections = buildTranscriptSections(transcriptAnswers);
  const submittedAt = new Date(data.created_at).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--accent)' }}>
          Career Pathway - Submission View
        </p>
        <h1 className="text-2xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
          {data.name || 'Anonymous'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {data.email || 'No email'} · {data.country || '-'} · {data.age_range || '-'} · {submittedAt}
        </p>
        {data.discovery_source && (
          <p className="text-xs text-muted-foreground">Found via: {data.discovery_source}</p>
        )}
        {refinementTriggered && (
          <p className="text-xs text-muted-foreground">
            Refinement triggered. Base top score: {data.base_top_score ?? '-'} · Final top score: {data.final_top_score ?? '-'}
          </p>
        )}
      </div>

      <ResultsBlock title="Final top matches" results={results} />

      {moatResults.length > 0 && (
        <ResultsBlock title="Long-term moat path" results={moatResults} />
      )}

      {refinementTriggered && baseResults.length > 0 && (
        <ResultsBlock title="Base top matches before refinement" results={baseResults} />
      )}

      {transcriptSections.map((section) => (
        <div key={section.title} className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{section.title}</h2>
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col gap-4 text-sm">
              {section.questions.map((question) => (
                <div key={question.id} className="flex flex-col gap-1">
                  <span className="font-semibold text-muted-foreground">{question.text}</span>
                  <span>{question.selectedLabels.join(', ') || 'No answer recorded'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
