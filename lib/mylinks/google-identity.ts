/**
 * Google Identity Services (GIS) for MyLinks sign-in, the pattern Radar uses
 * (Steve Toth/radar/lib/auth/google-identity.ts, 2026-09-02).
 *
 * Why not supabase.auth.signInWithOAuth: that flow routes the browser through
 * Supabase's callback, so Google prints Supabase's domain on the consent screen
 * and brand verification can never fix it (we do not own supabase.co). With GIS
 * the popup opens from our origin, Google hands the page a signed ID token, and
 * supabase.auth.signInWithIdToken makes the same session. Supabase stays out of
 * Google's picture.
 *
 * Nonce: GIS echoes the nonce it is given, verbatim, in the token. Supabase
 * compares the SHA-256 of the nonce it is given to that claim. So the RAW value
 * goes to Supabase and the HASH goes to Google. Keep "Skip nonce checks" off in
 * the Supabase dashboard.
 */

export const GOOGLE_GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/** Public by design: it is in the login page's HTML. Build-inlined like every NEXT_PUBLIC_*. */
export function googleClientId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  return id && id.length > 0 ? id : null;
}

export function generateNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
