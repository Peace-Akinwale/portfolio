export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto h-6 w-64 animate-pulse rounded bg-[var(--muted)]" />
      </div>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-[var(--muted)]" />
        <div className="flex gap-3 mb-6">
          <div className="h-10 w-32 animate-pulse rounded-full bg-[var(--muted)]" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--muted)]" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-[1rem] border border-border bg-background"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
