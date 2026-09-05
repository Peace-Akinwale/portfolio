import { CLIENTS } from '@/lib/content/clients';
import { cx } from '@/lib/cx';

/** The client list, set as a line of names between hairlines. */
export function ClientRow({ label = 'Written for', className }: { label?: string; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-5 border-y border-border py-6 sm:flex-row sm:items-center sm:gap-10', className)}>
      <p className="t-label shrink-0 text-muted-foreground">{label}</p>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {CLIENTS.map((c) => (
          <li key={c.domain} className="flex items-center gap-2 text-sm font-medium text-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.favicon} alt="" width={16} height={16} className="h-4 w-4 rounded-sm" loading="lazy" />
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
