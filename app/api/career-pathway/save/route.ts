// app/api/career-pathway/save/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

async function sendSlackNotification(data: {
  name?: string;
  email?: string;
  country?: string;
  ageRange?: string;
  discoverySource?: string;
  results: { careerId: string; score: number; rank: number }[];
  count: number | null;
}) {
  const webhookUrl = process.env.CAREER_PATHWAY_SLACK_WEBHOOK;
  if (!webhookUrl) return;

  const top = data.results.find((r) => r.rank === 1);
  const second = data.results.find((r) => r.rank === 2);
  const countLabel = data.count != null ? ` — submission #${data.count}` : '';

  const lines = [
    `*🎯 New Career Assessment${countLabel}*`,
    `*Name:* ${data.name || '_not provided_'}`,
    `*Email:* ${data.email || '_not provided_'}`,
    `*Top match:* ${top?.careerId ?? '—'} (${top?.score ?? '—'} pts)`,
    second ? `*#2:* ${second.careerId} (${second.score} pts)` : null,
    `*Country:* ${data.country || '—'} · *Age range:* ${data.ageRange || '—'}`,
    data.discoverySource ? `*Found via:* ${data.discoverySource}` : null,
  ].filter(Boolean).join('\n');

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines }),
  }).catch(() => {/* silently ignore */});
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, discoverySource, ageRange, country, answers, results, email } = body;

    if (!answers || !results) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const userAgent = req.headers.get('user-agent') ?? null;

    const { error } = await supabase.from('career_pathway_responses').insert({
      name: name ?? null,
      discovery_source: discoverySource ?? null,
      age_range: ageRange ?? null,
      country: country ?? null,
      answers,
      results,
      email: email ?? null,
      user_agent: userAgent,
    });

    if (error) throw error;

    const { count } = await supabase
      .from('career_pathway_responses')
      .select('*', { count: 'exact', head: true });

    sendSlackNotification({ name, email, country, ageRange, discoverySource, results, count: count ?? null });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/save]', err);
    return NextResponse.json({ error: 'Failed to save response.' }, { status: 500 });
  }
}
