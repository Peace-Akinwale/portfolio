export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-6 w-24 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-[var(--muted)]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-[1.5rem] border border-border bg-background"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
