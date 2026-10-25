'use client';

import { useEffect, useRef, useState } from 'react';
import { monthLabel, monthShort } from '@/lib/content/dates';

// Progressive enhancement over the server-rendered entries: the filter hides
// entries by kind, the month rail and the "now" label follow the scroll, and an
// open <details> is remembered in the URL hash. Without JavaScript the full
// record is visible and the in-page anchors still work.
type Filter = 'all' | 'built' | 'wrote';

function applyFilter(filter: Filter): number {
  const entries = Array.from(document.querySelectorAll<HTMLElement>('.entry'));
  let shown = 0;
  for (const e of entries) {
    const kind = e.dataset.kind;
    const visible = filter === 'all' || kind === filter || (filter === 'wrote' && kind === 'said') || (filter === 'built' && kind === 'decided');
    e.hidden = !visible;
    if (visible) shown++;
  }
  window.dispatchEvent(new Event('record:filtered'));
  return shown;
}

export function RecordFilters() {
  const [filter, setFilter] = useState<Filter>('all');
  const [status, setStatus] = useState('');

  function choose(next: Filter) {
    const shown = applyFilter(next);
    setFilter(next);
    setStatus(`${shown} ${shown === 1 ? 'entry' : 'entries'} shown`);
  }

  const options: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Everything' },
    { key: 'built', label: 'Building' },
    { key: 'wrote', label: 'Writing' },
  ];

  return (
    <>
      <div className="record-filters" role="group" aria-label="Show">
        {options.map((o) => (
          <button key={o.key} type="button" aria-pressed={filter === o.key} onClick={() => choose(o.key)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{status}</p>
    </>
  );
}

export function RecordNow({ initialMonth }: { initialMonth: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function update() {
      const line = window.innerHeight * 0.35;
      const entries = Array.from(document.querySelectorAll<HTMLElement>('.entry')).filter((e) => !e.hidden);
      let current: HTMLElement | null = null;
      for (const e of entries) {
        if (e.getBoundingClientRect().top <= line) current = e;
        else break;
      }
      const month = (current ?? entries[0])?.dataset.month;
      if (!month) return;
      el!.textContent = monthLabel(month);
      document.querySelectorAll<HTMLAnchorElement>('.rail a').forEach((a) => {
        if (a.dataset.month === month) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('record:filtered', update);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      window.removeEventListener('record:filtered', update);
    };
  }, []);
  return <b ref={ref}>{monthLabel(initialMonth)}</b>;
}

export function MonthRail({ months }: { months: string[] }) {
  useEffect(() => {
    function recount() {
      const counts = new Map<string, number>();
      document.querySelectorAll<HTMLElement>('.entry').forEach((e) => {
        if (e.hidden) return;
        counts.set(e.dataset.month!, (counts.get(e.dataset.month!) ?? 0) + 1);
      });
      document.querySelectorAll<HTMLElement>('.rail li').forEach((li) => {
        const n = counts.get(li.dataset.month!) ?? 0;
        li.hidden = n === 0;
        const small = li.querySelector('small');
        if (small) small.textContent = n > 1 ? `${n} entries` : '';
      });
    }
    window.addEventListener('record:filtered', recount);
    recount();
    return () => window.removeEventListener('record:filtered', recount);
  }, []);

  return (
    <nav className="rail" aria-label="Months">
      <ol>
        {months.map((m) => (
          <li key={m} data-month={m}>
            <a href={`#m-${m}`} data-month={m}>
              {monthShort(m)}
              <small />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function OpenDetailsFromHash() {
  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>('.entry details[id]').forEach((d) => {
      d.addEventListener('toggle', () => { if (d.open) history.replaceState(null, '', `#${d.id}`); });
    });
    if (location.hash) {
      const d = document.getElementById(location.hash.slice(1));
      if (d && d.tagName === 'DETAILS') (d as HTMLDetailsElement).open = true;
    }
  }, []);
  return null;
}
