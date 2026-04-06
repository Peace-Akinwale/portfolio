export default function MylinksWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[var(--muted)]/45">{children}</div>;
}
