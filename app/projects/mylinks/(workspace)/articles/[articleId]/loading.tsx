export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto h-6 w-80 animate-pulse rounded bg-[var(--muted)]" />
      </div>
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
          <div className="border-b border-border px-4 py-4 sm:px-6">
            <div className="h-6 w-2/3 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-4 flex gap-3">
              <div className="h-10 w-44 animate-pulse rounded-full bg-[var(--muted)]" />
              <div className="h-10 w-36 animate-pulse rounded-full bg-[var(--muted)]" />
              <div className="h-10 w-32 animate-pulse rounded-full bg-[var(--muted)]" />
            </div>
          </div>
          <div className="grid gap-6 p-6 xl:grid-cols-[1.3fr_1fr]">
            <div className="space-y-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 w-full animate-pulse rounded bg-[var(--muted)]" />
              ))}
            </div>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-[1rem] border border-border bg-background"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
