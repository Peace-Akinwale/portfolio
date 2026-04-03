import Link from 'next/link';

interface ArticleEndCtaProps {
  title?: string;
}

export function ArticleEndCta({
  title = 'Need product-led content that actually helps readers choose your product?',
}: ArticleEndCtaProps) {
  return (
    <section className="mt-12 rounded-[1.5rem] border border-border bg-[var(--muted)]/75 px-6 py-8 sm:px-8">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
          Work With Me
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          I write and refresh B2B SaaS articles that explain your product clearly,
          support search intent, and give readers a real reason to convert.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            See Services
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:bg-background"
          >
            Book A Call
          </Link>
        </div>
      </div>
    </section>
  );
}
