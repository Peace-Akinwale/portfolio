/**
 * Who may use MyLinks. The list lives in Postgres (`mylinks_allowlist`,
 * `mylinks_allowed_domains`, asked through `mylinks_signup_allowed`).
 *
 * Since 2026-10-31 the list is checked by the app on every signed-in page and
 * route (`requireAuthenticatedUser`), not by a trigger on auth.users. The
 * Supabase project is shared with Aloud, so a trigger there refused Aloud's
 * new accounts, and it never stopped an account that already existed.
 */
export class GateNotInstalled extends Error {}

/**
 * Fails closed on any error, with one exception: when the gate function does
 * not exist (migration not applied), the probe answers "listed" so the login
 * page does not lock everyone out of a fresh database.
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
      console.error('[mylinks allowlist] gate not installed, letting the request through');
      return true;
    }
    return false;
  }
}

type RpcResult = { data: unknown; error: { code?: string; message: string } | null };

/** Asks Postgres. Throws GateNotInstalled when the function is missing. */
export async function askAllowlist(
  email: string,
  rpc: (fn: 'mylinks_signup_allowed', args: { p_email: string }) => PromiseLike<RpcResult>
): Promise<boolean> {
  const { data, error } = await rpc('mylinks_signup_allowed', { p_email: email });
  if (error) {
    // PostgREST answers PGRST202 when the function is not in the schema cache.
    if (error.code === 'PGRST202' || /could not find the function/i.test(error.message)) {
      throw new GateNotInstalled(error.message);
    }
    console.error('[mylinks allowlist] mylinks_signup_allowed failed:', error.message);
    return false;
  }
  return data === true;
}
