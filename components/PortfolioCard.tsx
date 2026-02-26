'use client';

import type { PortfolioProject } from '@/lib/hashnode/parsePortfolio';

/* ── Brand colors for known clients ── */
const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  manyrequests:    { bg: '#EDEDFF', text: '#3B3FC5' }, // indigo from logo
  manyrequest:     { bg: '#EDEDFF', text: '#3B3FC5' },
  highervisibility:{ bg: '#FEF7E8', text: '#9A7B1A' }, // gold/amber from logo swoosh
  pangea:          { bg: '#EDF5F0', text: '#1B3A2D' }, // forest green from logo
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
function getPillColor(clientName: string) {
  const key = clientName.toLowerCase().replace(/[\s._-]/g, '');
  for (const [brand, color] of Object.entries(BRAND_COLORS)) {
    if (key.includes(brand)) return color;
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
  const pill = clientName ? getPillColor(clientName) : null;

  return (
    <div
      className="border border-border rounded-xl bg-background transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)]"
      style={{ padding: '24px 24px 20px' }}
    >
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
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.02em',
            textDecoration: 'none',
            textUnderlineOffset: '2px',
          }}
        >
          Read article ↗
        </a>
      )}
    </div>
  );
}
