'use client';

import { useTheme } from 'next-themes';
import type { PortfolioProject } from '@/lib/hashnode/parsePortfolio';

/* ── Brand colors for known clients ── */
const BRAND_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  manyrequests:    { bg: '#EDEDFF', text: '#3B3FC5', darkBg: '#1e1b4b', darkText: '#a5b4fc' },
  manyrequest:     { bg: '#EDEDFF', text: '#3B3FC5', darkBg: '#1e1b4b', darkText: '#a5b4fc' },
  highervisibility:{ bg: '#FEF7E8', text: '#9A7B1A', darkBg: '#2d1e00', darkText: '#fbbf24' },
  pangea:          { bg: '#EDF5F0', text: '#1B3A2D', darkBg: '#0d2318', darkText: '#6ee7b7' },
};

/* ── Fallback palette for unknown clients ── */
const FALLBACK_COLORS = [
  { bg: '#FFF7ED', text: '#C2410C' }, // warm orange
  { bg: '#F0F9FF', text: '#0369A1' }, // sky blue
  { bg: '#FDF4FF', text: '#7E22CE' }, // purple
  { bg: '#F0FDFA', text: '#0F766E' }, // teal
  { bg: '#FFF1F2', text: '#BE123C' }, // rose
  { bg: '#FFFBEB', text: '#A16207' }, // amber
  { bg: '#F0FDF4', text: '#15803D' }, // emerald
  { bg: '#FEF2F2', text: '#B91C1C' }, // red
];

/**
 * Get pill color from the client name.
 * Matches known brands first, then hashes the name to pick a consistent fallback.
 */
function getPillColor(clientName: string, isDark: boolean) {
  const key = clientName.toLowerCase().replace(/[\s._-]/g, '');
  for (const [brand, color] of Object.entries(BRAND_COLORS)) {
    if (key.includes(brand)) {
      return { bg: isDark ? color.darkBg : color.bg, text: isDark ? color.darkText : color.text };
    }
  }
  // Deterministic hash so the same name always gets the same color
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

interface PortfolioCardProps {
  project: PortfolioProject;
  clientName?: string;
}

export function PortfolioCard({ project, clientName }: PortfolioCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const pill = clientName ? getPillColor(clientName, isDark) : null;

  const inner = (
    <>
      {clientName && pill && (
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            padding: '3px 10px',
            borderRadius: '8px',
            marginBottom: '14px',
            backgroundColor: pill.bg,
            color: pill.text,
          }}
        >
          {clientName}
        </span>
      )}

      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          fontWeight: 600,
          lineHeight: 1.45,
          color: 'var(--foreground)',
          marginBottom: '14px',
        }}
      >
        {project.title}
      </h3>

      {project.link && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.02em',
          }}
        >
          Read article ↗
        </span>
      )}
    </>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-border rounded-xl bg-background transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)]"
        style={{ padding: '24px 24px 20px', textDecoration: 'none' }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="border border-border rounded-xl bg-background"
      style={{ padding: '24px 24px 20px' }}
    >
      {inner}
    </div>
  );
}
