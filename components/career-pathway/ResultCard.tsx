'use client';

import { useState } from 'react';
import { getYoutubeExplainers } from '@/lib/career-pathway/resources';
import { resolveWhyItFits } from '@/lib/career-pathway/scoring';
import type { Answers, ScoredCareer } from '@/lib/career-pathway/types';

interface Props {
  result: ScoredCareer;
  userName?: string;
  answers?: Answers;
  familyPressureHigh?: boolean;
  labelOverrides?: readonly string[];
  forceTimingNote?: boolean;
}

const rankLabel = ['Best Fit', 'Best Alternative', 'Worth Exploring', 'Worth Exploring'] as const;

export function ResultCard({
  result,
  userName,
  answers = {},
  familyPressureHigh = false,
  labelOverrides,
  forceTimingNote = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { career, rank } = result;
  const whyItFits = resolveWhyItFits(career, answers, userName);
  const videoResources = getYoutubeExplainers(career.resources);

  const urgentAnswer = answers.C1 as string | undefined;
  const urgencyMaxMonths: Record<string, number> = {
    urgent: 6,
    'within-year': 12,
    'one-two-years': 24,
    'no-rush': 999,
  };
  const userMaxMonths = urgencyMaxMonths[urgentAnswer ?? ''] ?? 999;
  const careerExceedsTimeline = career.timeToFirstIncome.min > userMaxMonths;
  const showTimingNote = familyPressureHigh && careerExceedsTimeline && (forceTimingNote || rank >= 3);
  const label = labelOverrides?.[rank - 1] ?? rankLabel[rank - 1];
  const isBest = rank === 1;

  return (
    <div
      className="rounded-xl border p-6 flex flex-col gap-4"
      style={{
        borderColor: isBest ? 'var(--accent)' : 'var(--border)',
        background: isBest ? 'color-mix(in srgb, var(--accent) 6%, var(--background))' : 'var(--background)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-[0.1em]"
            style={{ color: isBest ? 'var(--accent)' : 'var(--muted-foreground)' }}
          >
            {label}
          </span>
          <h3 className="text-xl font-extrabold mt-1" style={{ letterSpacing: '-0.02em' }}>
            {career.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{career.subtitle}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: whyItFits }} />

      {showTimingNote && (
        <div
          className="text-xs px-3 py-2 rounded-md"
          style={{
            background: 'color-mix(in srgb, var(--accent) 8%, var(--background))',
            color: 'var(--foreground)',
          }}
        >
          <strong>Worth your attention:</strong> This career takes {career.timeToFirstIncome.min}-{career.timeToFirstIncome.max} months to start earning from. Given your timeline, your top matches above are faster paths, but this one has a higher long-term income ceiling and is worth keeping in mind.
        </div>
      )}

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex gap-2">
          <span className="font-semibold shrink-0">Time to first income:</span>
          <span className="text-muted-foreground">
            {career.timeToFirstIncome.min}-{career.timeToFirstIncome.max} months
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold shrink-0">What it costs to start:</span>
          <span className="text-muted-foreground">
            {career.requiresCertification
              ? `Free learning path, but ${career.certificationDetails ?? 'certification exam required'} to get hired`
              : 'Free - the entire learning path is free'}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold shrink-0">Entry requirement:</span>
          <span className="text-muted-foreground">{career.entryDescription}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold shrink-0">AI reality:</span>
          <span className="text-muted-foreground">{career.aiRealityDescription}</span>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-bold uppercase tracking-[0.08em] self-start underline underline-offset-2 mt-1"
        style={{ color: 'var(--accent)' }}
      >
        {expanded ? 'Less detail' : 'More detail'}
      </button>

      {expanded && (
        <div className="flex flex-col gap-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">
              A day in this role
            </h4>
            <p className="text-sm leading-relaxed">{career.dailyLifeDescription}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">
              Income by region
            </h4>
            <div className="flex flex-col gap-1 text-sm">
              <span>US: ${career.incomeRanges.us.min.toLocaleString()}-${career.incomeRanges.us.max.toLocaleString()}/yr entry</span>
              <span>UK: GBP {career.incomeRanges.uk.min.toLocaleString()}-GBP {career.incomeRanges.uk.max.toLocaleString()}/yr entry</span>
              <span>Global remote: ${career.incomeRanges.global_remote.min.toLocaleString()}-${career.incomeRanges.global_remote.max.toLocaleString()}/yr</span>
              <span className="text-muted-foreground text-xs mt-1">Timelines assume 15-30 hours/week of focused learning.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">
              Start here (15 minutes)
            </h4>
            <a
              href={career.resources.startHere.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline underline-offset-2"
              style={{ color: 'var(--accent)' }}
            >
              {career.resources.startHere.title}
            </a>
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mt-4 mb-2">
              Keep going
            </h4>
            <div className="flex flex-col gap-2">
              {career.resources.learning.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ color: 'var(--accent)' }}
                >
                  {resource.title} - <span className="text-muted-foreground">{resource.description}</span>
                </a>
              ))}
              {videoResources.map((video) => (
                <a
                  key={video.url}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ color: 'var(--accent)' }}
                >
                  Video: {video.title} - <span className="text-muted-foreground">{video.description}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-4 text-sm" style={{ background: 'var(--muted)' }}>
            <span className="font-semibold">Honest note: </span>
            {career.honestCaveat}
          </div>
        </div>
      )}
    </div>
  );
}
