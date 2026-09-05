import { cx } from '@/lib/cx';

/** A real figure and what it measures. Never an invented number. */
export function Stat({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <span className="t-h2 tabular text-foreground">{value}</span>
      <span className="text-sm leading-snug text-muted-foreground">{label}</span>
    </div>
  );
}
