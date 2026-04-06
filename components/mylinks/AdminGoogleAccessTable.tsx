'use client';

import { useState } from 'react';

interface AccessRequestRow {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  requested_at: string;
  reviewed_at: string | null;
}

interface ProfileRow {
  user_id: string;
  email: string | null;
  full_name: string | null;
  found_via: string | null;
}

export function AdminGoogleAccessTable({
  initialRequests,
  profiles,
}: {
  initialRequests: AccessRequestRow[];
  profiles: ProfileRow[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [busyId, setBusyId] = useState<string | null>(null);

  const profileMap = new Map(profiles.map((profile) => [profile.user_id, profile]));

  async function updateRequest(id: string, status: 'approved' | 'rejected') {
    setBusyId(id);
    const response = await fetch(`/api/mylinks/admin/google-access/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const payload = (await response.json()) as { request?: AccessRequestRow };
    if (response.ok && payload.request) {
      setRequests((current) =>
        current.map((request) => (request.id === id ? payload.request! : request))
      );
    }
    setBusyId(null);
  }

  if (requests.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No Google access requests yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {requests.map((request) => {
        const profile = profileMap.get(request.user_id);

        return (
          <article key={request.id} className="rounded-[1.5rem] border border-border bg-background p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-foreground">
                    {profile?.full_name || profile?.email || request.user_id}
                  </p>
                  <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {request.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{profile?.email}</p>
                {profile?.found_via ? (
                  <p className="mt-1 text-sm text-muted-foreground">Found via: {profile.found_via}</p>
                ) : null}
                <p className="mt-1 text-sm text-muted-foreground">
                  Requested: {new Date(request.requested_at).toLocaleString()}
                </p>
                {request.notes ? (
                  <p className="mt-3 text-sm text-muted-foreground">{request.notes}</p>
                ) : null}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={busyId === request.id}
                  onClick={() => updateRequest(request.id, 'approved')}
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--accent)' }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === request.id}
                  onClick={() => updateRequest(request.id, 'rejected')}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
