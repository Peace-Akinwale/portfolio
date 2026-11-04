// A small price table (design guide §9 and §29, 4 Nov 2026): the service on the
// left, its price on the right edge in tabular figures, the unit as supporting
// text under the name. A price never wraps away from its currency, comparable
// facts sit in comparable positions, and a hairline carries the eye across.
export interface PriceRow {
  name: string;
  price: string; // "$400", or a word such as "Custom"
  unit?: string; // "2,000 to 2,500 words", "per post"
  note?: string; // one short clause, e.g. the discount a bundle gives
}

export function PriceList({ rows, label }: { rows: PriceRow[]; label: string }) {
  return (
    <dl className="prices" aria-label={label}>
      {rows.map((r) => (
        <div className="price-row" key={r.name}>
          <dt>
            <span className="price-name">{r.name}</span>
            {(r.unit || r.note) && <span className="price-unit">{[r.unit, r.note].filter(Boolean).join('. ')}</span>}
          </dt>
          <dd className="price-value">{r.price}</dd>
        </div>
      ))}
    </dl>
  );
}
