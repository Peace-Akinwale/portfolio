import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

export const COMMENT_ADMIN_COOKIE = 'comment_admin_session';
export const COMMENT_ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7;

function getAdminPassword() {
  return process.env.COMMENT_ADMIN_PASSWORD || process.env.ADMIN_DASHBOARD_PASSWORD || '';
}

export function hasCommentAdminPassword() {
  return Boolean(getAdminPassword());
}

function safeEqual(a: string, b: string) {
  const left = createHash('sha256').update(a).digest();
  const right = createHash('sha256').update(b).digest();
  return timingSafeEqual(left, right);
}

export function validateCommentAdminPassword(password: string) {
  const expected = getAdminPassword();
  return Boolean(expected) && safeEqual(password, expected);
}

// A session is "<expiry>.<random id>.<signature>". Each login gets its own id and
// an expiry, and the cookie is a signature rather than a hash of the password, so
// a copied cookie stops working when it expires or when that session signs out.
// (Until 24 Nov 2026 the cookie was sha256(password), the same for every login.)
function sign(payload: string) {
  return createHmac('sha256', `${getAdminPassword()}::peaceakinwale-comments`).update(payload).digest('hex');
}

// Signed-out session ids. Process memory: a restart forgets them, and the expiry
// then bounds how long a signed-out cookie could still work.
const revoked = new Map<string, number>();

export function createCommentAdminSessionToken(now: number = Date.now()) {
  const payload = `${Math.floor(now / 1000) + COMMENT_ADMIN_SESSION_SECONDS}.${randomBytes(16).toString('hex')}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidCommentAdminSession(value?: string | null, now: number = Date.now()) {
  if (!value || !hasCommentAdminPassword()) return false;
  const [expiry, id, signature, ...rest] = value.split('.');
  if (!expiry || !id || !signature || rest.length) return false;
  if (!safeEqual(signature, sign(`${expiry}.${id}`))) return false;
  if (!/^\d+$/.test(expiry) || Number(expiry) * 1000 <= now) return false;
  return !revoked.has(id);
}

export function revokeCommentAdminSession(value?: string | null, now: number = Date.now()) {
  if (!isValidCommentAdminSession(value, now)) return;
  const [expiry, id] = value!.split('.');
  for (const [key, until] of revoked) if (until <= now) revoked.delete(key);
  revoked.set(id, Number(expiry) * 1000);
}
