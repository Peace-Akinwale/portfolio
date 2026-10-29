/**
 * Pre-login allowlist decision, kept out of the route file because Next only
 * allows HTTP method exports there. The rule itself lives in Postgres
 * (`mylinks_signup_allowed`, migration 20261029_mylinks_signup_allowlist); the
 * sign-up trigger calls the same function, so the two cannot drift.
 */
export class GateNotInstalled extends Error {}

/**
 * Fails closed on any error, with one exception: when the gate function does
 * not exist yet (migration not applied), there is no trigger either, so the
 * probe answers "listed" and lets Supabase decide, as it did before the gate.
 */
export async function decideListed(
  rawEmail: string,
  ask: (email: string) => Promise<boolean>
): Promise<boolean> {
  const email = rawEmail.trim().toLowerCase();
  if (!email) return false;
  try {
    return (await ask(email)) === true;
  } catch (error) {
    if (error instanceof GateNotInstalled) {
      console.error('[check-allowlist] gate not installed, letting Supabase decide');
      return true;
    }
    return false;
  }
}
