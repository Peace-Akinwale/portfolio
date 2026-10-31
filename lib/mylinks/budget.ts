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

type ServiceClient = {
  from: (table: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

/** The account's budget row and lifetime spend. */
export async function readBudget(serviceClient: ServiceClient, userId: string, email: string) {
  const [{ data: row }, { data: logs }] = await Promise.all([
    serviceClient.from('mylinks_allowlist').select('budget_usd').eq('email', email.trim().toLowerCase()).maybeSingle(),
    serviceClient.from('llm_usage_logs').select('estimated_cost_usd').eq('user_id', userId),
  ]);
  const spent = (logs ?? []).reduce(
    (sum: number, r: { estimated_cost_usd: number | null }) => sum + Number(r.estimated_cost_usd ?? 0),
    0
  );
  return { budgetUsd: (row?.budget_usd ?? null) as number | null, spentUsd: spent };
}

/** A 402 to return before a paid call, or null when the account may spend. */
export async function budgetBlock(serviceClient: ServiceClient, user: { id: string; email?: string | null }) {
  const { budgetUsd, spentUsd } = await readBudget(serviceClient, user.id, user.email ?? '');
  return withinBudget(budgetUsd, spentUsd)
    ? null
    : NextResponse.json({ error: MSG_BUDGET_SPENT, code: 'budget_spent' }, { status: 402 });
}
