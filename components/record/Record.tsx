import Link from 'next/link';
import Image from 'next/image';
import { KIND_LABEL, type RecordEntry } from '@/lib/content/record';

function Href({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (href.startsWith('/')) return <Link href={href} className={className}>{children}</Link>;
  return <a href={href} rel="noopener" target="_blank" className={className}>{children}</a>;
}

export function Entry({ entry, firstOfMonth }: { entry: RecordEntry; firstOfMonth: boolean }) {
  return (
    <article className="entry" data-kind={entry.kind} data-month={entry.month} id={entry.id}>
      {firstOfMonth && <span id={`m-${entry.month}`} style={{ display: 'block', position: 'relative', top: -120 }} aria-hidden="true" />}
      <header>
        <time dateTime={entry.date}>{entry.dateLabel}</time>
        <span className="kind">{KIND_LABEL[entry.kind]}</span>
        {entry.context && <span>{entry.context}</span>}
      </header>
      {entry.kind !== 'said' && (
        <h2>{entry.href ? <Href href={entry.href}>{entry.title}</Href> : entry.title}</h2>
      )}
      {entry.quote && (
        <>
          <blockquote className="pull">“{entry.quote.text}”</blockquote>
          <p className="pull-by">{entry.quote.by}</p>
        </>
      )}
      {entry.body.length > 0 && (
        <div className="body">
          {entry.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
      {entry.figure && (
        <figure className={`shot${entry.figure.narrow ? ' narrow' : ''}`}>
          <Image src={entry.figure.src} width={entry.figure.width} height={entry.figure.height} alt={entry.figure.alt} loading="lazy" sizes={entry.figure.narrow ? '360px' : '(max-width: 900px) 100vw, 860px'} />
          {entry.figure.caption && <figcaption>{entry.figure.caption}</figcaption>}
        </figure>
      )}
      {entry.facts && (
        <dl className="kv">
          {entry.facts.map((f) => (
            <div key={f.k} className="contents"><dt>{f.k}</dt><dd>{f.v}</dd></div>
          ))}
        </dl>
      )}
      {entry.more && (
        <details id={`${entry.id}-more`}>
          <summary>{entry.more.summary}</summary>
          <div className="inner">
            {entry.more.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </details>
      )}
      {entry.links.length > 0 && (
        <p className="go">
          {entry.links.map((l) => <Href key={l.href + l.label} href={l.href}>{l.label}</Href>)}
        </p>
      )}
    </article>
  );
}

export function Entries({ entries }: { entries: RecordEntry[] }) {
  const seen = new Set<string>();
  return (
    <div className="entries" id="entries">
      {entries.map((e) => {
        const first = !seen.has(e.month);
        seen.add(e.month);
        return <Entry key={e.id} entry={e} firstOfMonth={first} />;
      })}
    </div>
  );
}
