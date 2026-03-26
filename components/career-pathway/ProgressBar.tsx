// components/career-pathway/ProgressBar.tsx
interface Props {
  current: number; // 1-indexed
  total: number;
  phase?: string;
}

export function ProgressBar({ current, total, phase }: Props) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full">
      {phase && (
        <p className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--muted-foreground)' }}>
          {phase} · {current} of {total}
        </p>
      )}
      <div className="w-full h-1 rounded-full" style={{ background: 'var(--muted)' }}>
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: 'var(--accent)' }}
        />
      </div>
    </div>
  );
}
