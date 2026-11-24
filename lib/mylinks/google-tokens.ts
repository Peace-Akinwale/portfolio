import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { refreshAccessToken } from '@/lib/mylinks/google-auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

// Google access and refresh tokens are encrypted before they are stored
// (AES-256-GCM, key derived from MYLINKS_TOKEN_KEY). Rows written before
// 24 Nov 2026 hold plain tokens: they are still read, and re-saved encrypted the
// next time they are used. Without the key nothing is encrypted, so a missing
// variable cannot lock anyone out; it is logged once.
const PREFIX = 'enc:v1:';
let warned = false;

function key(): Buffer | null {
  const secret = process.env.MYLINKS_TOKEN_KEY;
  if (!secret) {
    if (!warned) { warned = true; console.warn('[mylinks] MYLINKS_TOKEN_KEY is not set; Google tokens are stored unencrypted.'); }
    return null;
  }
  return createHash('sha256').update(secret).digest();
}

export function sealToken(plain: string): string {
  const k = key();
  if (!k || !plain || plain.startsWith(PREFIX)) return plain;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', k, iv);
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return PREFIX + Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64');
}

export function openToken(stored: string): string {
  if (!stored || !stored.startsWith(PREFIX)) return stored;
  const k = key();
  if (!k) throw new Error('Google connection cannot be read: MYLINKS_TOKEN_KEY is missing');
  const raw = Buffer.from(stored.slice(PREFIX.length), 'base64');
  const decipher = createDecipheriv('aes-256-gcm', k, raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
}

// One implementation for every caller (apply, import, re-import). There used to
// be two copies of this function, one in the apply route.
export async function getValidAccessToken(userId: string): Promise<string> {
  const serviceClient = await createServiceClient();
  const { data: tokenRow } = await serviceClient
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!tokenRow) {
    throw new Error('Google account not connected');
  }

  const refreshToken = openToken(tokenRow.refresh_token);
  const legacy = Boolean(key()) && (!tokenRow.access_token.startsWith(PREFIX) || !tokenRow.refresh_token.startsWith(PREFIX));

  if (new Date(tokenRow.expires_at).getTime() > Date.now() + 60_000) {
    const accessToken = openToken(tokenRow.access_token);
    if (legacy) {
      const { error } = await serviceClient
        .from('google_tokens')
        .update({ access_token: sealToken(accessToken), refresh_token: sealToken(refreshToken) })
        .eq('user_id', userId);
      if (error) console.error('[mylinks/google] could not encrypt stored tokens:', error.message);
    }
    return accessToken;
  }

  const refreshed = await refreshAccessToken(refreshToken);
  const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  const { error } = await serviceClient
    .from('google_tokens')
    .update({ access_token: sealToken(refreshed.access_token), refresh_token: sealToken(refreshToken), expires_at: newExpiry })
    .eq('user_id', userId);
  // The new token still works for this request; the next one refreshes again.
  if (error) console.error('[mylinks/google] refreshed token was not saved:', error.message);

  return refreshed.access_token;
}
