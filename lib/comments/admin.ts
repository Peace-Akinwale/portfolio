import { createHash, timingSafeEqual } from 'crypto';

export const COMMENT_ADMIN_COOKIE = 'comment_admin_session';

function getAdminPassword() {
  return process.env.COMMENT_ADMIN_PASSWORD || process.env.ADMIN_DASHBOARD_PASSWORD || '';
}

function getSessionTokenSource() {
  return `${getAdminPassword()}::peaceakinwale-comments`;
}

export function hasCommentAdminPassword() {
  return Boolean(getAdminPassword());
}

export function validateCommentAdminPassword(password: string) {
  const expected = getAdminPassword();
  return Boolean(expected) && password === expected;
}

export function createCommentAdminSessionToken() {
  return createHash('sha256').update(getSessionTokenSource()).digest('hex');
}

export function isValidCommentAdminSession(value?: string | null) {
  if (!value || !hasCommentAdminPassword()) {
    return false;
  }

  const expected = createCommentAdminSessionToken();
  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}
