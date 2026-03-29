'use client';

import type { PortfolioProject } from '@/lib/hashnode/parsePortfolio';

interface PortfolioCardProps {
  project: PortfolioProject;
  clientName?: string;
  ogImage?: string | null;
  faviconUrl?: string | null;
}

export function PortfolioCard({ project, clientName }: PortfolioCardProps) {
  const inner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        height: '100%',
        minHeight: '160px',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: 1.45,
          color: 'var(--foreground)',
          marginBottom: '24px',
        }}
      >
        {project.title}
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {clientName && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
            }}
          >
            {clientName}
          </span>
        )}
        {project.link && (
          <span
            style={{
              fontSize: '14px',
              color: 'var(--muted-foreground)',
              marginLeft: 'auto',
            }}
          >
            ↗
          </span>
        )}
      </div>
    </div>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-border rounded-lg bg-background transition-shadow duration-200 hover:shadow-md"
        style={{ textDecoration: 'none' }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-background">
      {inner}
    </div>
  );
}
