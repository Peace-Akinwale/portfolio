import { NextResponse } from 'next/server';

/**
 * Self sign-up with a lifetime AI budget (Peace, 2026-10-31): anyone who signs
 * in is added to mylinks_allowlist with budget_usd = 2. Rows Peace adds by
 * hand have budget_usd null and no cap. Spend is the sum of
 * llm_usage_logs.estimated_cost_usd for the user, so every paid call must log.
 */
export const SELF_SIGNUP_BUDGET_USD = 2;

export const MSG_BUDGET_SPENT =
  'You have used the $2 of AI usage that comes with a MyLinks account. Ask Peace for more.';

/** Pure: true when the account may spend more. A null budget means no cap. */
export function withinBudget(budgetUsd: number | null | undefined, spentUsd: number): boolean {
  if (budgetUsd === null || budgetUsd === undefined) return true;
  return spentUsd < Number(budgetUsd);
}

/** text-embedding-3-small list price, $0.02 per 1M tokens; ~4 characters a token. */
export function estimateEmbeddingCostUsd(texts: string[]): number {
  const chars = texts.reduce((sum, t) => sum + (t?.length ?? 0), 0);
  return Number((((chars / 4) / 1_000_000) * 0.02).toFixed(6));
}

const BUDGET_PAGE = 1000;

type ServiceClient = {
  from: (table: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

/** The account's budget row and lifetime spend. */
export async function readBudget(serviceClient: ServiceClient, userId: string, email: string) {
  const { data: row, error: rowError } = await serviceClient
    .from('mylinks_allowlist').select('budget_usd').eq('email', email.trim().toLowerCase()).maybeSingle();
  // A failed read used to look like "no cap" and "nothing spent". It is an error.
  if (rowError) throw new Error(`Could not read the AI budget: ${rowError.message}`);

  // The API returns at most 1000 rows a request, so the log is read in pages;
  // a single select stopped counting spend after the first 1000 rows.
  let spent = 0;
  for (let from = 0; ; from += BUDGET_PAGE) {
    const { data: logs, error } = await serviceClient
      .from('llm_usage_logs').select('estimated_cost_usd').eq('user_id', userId)
      .order('created_at', { ascending: true }).range(from, from + BUDGET_PAGE - 1);
    if (error) throw new Error(`Could not read AI usage: ${error.message}`);
    for (const r of (logs ?? []) as { estimated_cost_usd: number | null }[]) spent += Number(r.estimated_cost_usd ?? 0);
    if (!logs || logs.length < BUDGET_PAGE) break;
  }
  // No allowlist row at all is not one of Peace's uncapped rows: it gets the
  // self sign-up cap.
  const budgetUsd = row ? ((row.budget_usd ?? null) as number | null) : SELF_SIGNUP_BUDGET_USD;
  return { budgetUsd, spentUsd: spent };
}

/** A 402 to return before a paid call, or null when the account may spend. */
export async function budgetBlock(serviceClient: ServiceClient, user: { id: string; email?: string | null }) {
  let budget: { budgetUsd: number | null; spentUsd: number };
  try {
    budget = await readBudget(serviceClient, user.id, user.email ?? '');
  } catch (error) {
    console.error('[mylinks/budget]', error);
    return NextResponse.json({ error: 'AI usage could not be checked just now. Try again in a minute.', code: 'budget_unavailable' }, { status: 503 });
  }
  const { budgetUsd, spentUsd } = budget;
  return withinBudget(budgetUsd, spentUsd)
    ? null
    : NextResponse.json({ error: MSG_BUDGET_SPENT, code: 'budget_spent' }, { status: 402 });
}
