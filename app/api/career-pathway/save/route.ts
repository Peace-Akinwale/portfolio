import { randomUUID } from 'crypto';
import { allow, clientIp } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Answers, CareerResultSummary } from '@/lib/career-pathway/types';

interface SavePayload {
  name?: string | null;
  email?: string | null;
  country?: string | null;
  ageRange?: string | null;
  discoverySource?: string | null;
  answers: Answers;
  results: CareerResultSummary[];
  refinementTriggered?: boolean;
  refinementAnswers?: Answers | null;
  baseResults?: CareerResultSummary[] | null;
  baseTopScore?: number | null;
  finalTopScore?: number | null;
  moatResults?: CareerResultSummary[] | null;
}

async function sendSlackNotification(data: {
  name?: string | null;
  email?: string | null;
  country?: string | null;
  ageRange?: string | null;
  discoverySource?: string | null;
  results: CareerResultSummary[];
  count: number | null;
  submissionUrl: string | null;
  refinementTriggered?: boolean;
}) {
  const webhookUrl = process.env.CAREER_PATHWAY_SLACK_WEBHOOK;
  if (!webhookUrl) return;

  // Slack reads <...>, & and @-mentions in webhook text as markup, so text a
  // person typed is escaped and control mentions are defused before it is posted.
  const plain = (value: unknown) => String(value ?? '').slice(0, 120)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/@(channel|here|everyone)/gi, '@\u200b$1');
  const results = Array.isArray(data.results) ? data.results : [];
  const top = results.find((result) => result?.rank === 1);
  const second = results.find((result) => result?.rank === 2);
  const countLabel = data.count != null ? ` - submission #${data.count}` : '';

  const lines = [
    `*Career Assessment${countLabel}*`,
    `*Name:* ${data.name ? plain(data.name) : '_not provided_'}`,
    `*Email:* ${data.email ? plain(data.email) : '_not provided_'}`,
    `*Top match:* ${plain(top?.careerId ?? '-')} (${plain(top?.score ?? '-')} pts)`,
    second ? `*#2:* ${plain(second.careerId)} (${plain(second.score)} pts)` : null,
    `*Country:* ${plain(data.country || '-')} · *Age range:* ${plain(data.ageRange || '-')}`,
    data.discoverySource ? `*Found via:* ${plain(data.discoverySource)}` : null,
    data.refinementTriggered ? '*Refinement triggered:* yes' : null,
    data.submissionUrl ? `<${data.submissionUrl}|View full submission ->>` : null,
  ].filter(Boolean).join('\n');

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines }),
  }).catch(() => {
    // Silently ignore Slack failures.
  });
}

function insertErrorMentionsMissingRefinementColumns(error: unknown): boolean {
  // A PostgREST error is a plain object, so String(error) is "[object Object]".
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  return [
    'refinement_triggered',
    'refinement_answers',
    'base_results',
    'base_top_score',
    'final_top_score',
    'moat_results',
  ].some((column) => message.includes(column));
}

export async function POST(req: Request) {
  try {
    if (!allow(`cp-save:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many submissions. Try again in a few minutes.' }, { status: 429 });
    }
    // The whole payload is stored, so its size is bounded before it is parsed.
    const raw = await req.text();
    if (raw.length > 60_000) {
      return NextResponse.json({ error: 'That submission is too large.' }, { status: 413 });
    }
    const body = JSON.parse(raw) as SavePayload;
    const {
      name,
      discoverySource,
      ageRange,
      country,
      answers,
      results,
      email,
      refinementTriggered = false,
      refinementAnswers = null,
      baseResults = null,
      baseTopScore = null,
      finalTopScore = null,
      moatResults = null,
    } = body;

    const isRecord = (value: unknown) => typeof value === 'object' && value !== null && !Array.isArray(value);
    const shortText = (value: unknown) => value == null || (typeof value === 'string' && value.length <= 200);
    if (!isRecord(answers) || !Array.isArray(results)) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (![name, discoverySource, ageRange, country, email].every(shortText)) {
      return NextResponse.json({ error: 'One of the fields is too long.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const userAgent = req.headers.get('user-agent') ?? null;
    const id = randomUUID();

    const extendedInsert = {
      id,
      name: name ?? null,
      discovery_source: discoverySource ?? null,
      age_range: ageRange ?? null,
      country: country ?? null,
      answers,
      results,
      email: email ?? null,
      user_agent: userAgent,
      refinement_triggered: refinementTriggered,
      refinement_answers: refinementAnswers,
      base_results: baseResults,
      base_top_score: baseTopScore,
      final_top_score: finalTopScore,
      moat_results: moatResults,
    };

    let insertError: unknown = null;
    const { error } = await supabase.from('career_pathway_responses').insert(extendedInsert);
    insertError = error;

    if (insertError && insertErrorMentionsMissingRefinementColumns(insertError)) {
      const fallbackInsert = {
        id,
        name: name ?? null,
        discovery_source: discoverySource ?? null,
        age_range: ageRange ?? null,
        country: country ?? null,
        answers,
        results,
        email: email ?? null,
        user_agent: userAgent,
      };

      const fallbackResult = await supabase.from('career_pathway_responses').insert(fallbackInsert);
      insertError = fallbackResult.error;
    }

    if (insertError) throw insertError;

    const { count } = await supabase
      .from('career_pathway_responses')
      .select('*', { count: 'exact', head: true });

    const submissionUrl = `https://peaceakinwale.com/career-pathway/results/${id}`;

    void Promise.resolve().then(() => sendSlackNotification({
      name,
      email,
      country,
      ageRange,
      discoverySource,
      results,
      count: count ?? null,
      submissionUrl,
      refinementTriggered,
    })).catch((error) => console.error('[career-pathway/save][slack]', error));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/save]', err);
    return NextResponse.json({ error: 'Failed to save response.' }, { status: 500 });
  }
}
