// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { allow, clientIp, resetRateLimits } from '@/lib/rate-limit';
import { createCommentAdminSessionToken, isValidCommentAdminSession, revokeCommentAdminSession, validateCommentAdminPassword } from '@/lib/comments/admin';
import { locateAnchors } from '@/lib/mylinks/google-docs';
import { assertPublicUrl, isPrivateAddress } from '@/lib/mylinks/safe-fetch';
import { requestOrigin } from '@/lib/mylinks/routing';
import { normalizeRichTextHtml } from '@/lib/mylinks/rich-text';
import { skipOptimizer } from '@/lib/image-hosts';
import { createHash } from 'crypto';

describe('rate limit', () => {
  it('allows the limit and then refuses until the window ends', () => {
    resetRateLimits();
    expect([1, 2, 3].map(() => allow('k', 2, 1000, 0))).toEqual([true, true, false]);
    expect(allow('k', 2, 1000, 1001)).toBe(true);
  });
  it('ignores the first forwarded hop, which the client controls', () => {
    expect(clientIp(new Request('http://x', { headers: { 'x-forwarded-for': '1.1.1.1, 9.9.9.9' } }))).toBe('9.9.9.9');
    expect(clientIp(new Request('http://x', { headers: { 'x-real-ip': '8.8.8.8', 'x-forwarded-for': '1.1.1.1' } }))).toBe('8.8.8.8');
  });
});

describe('comment admin session', () => {
  it('is different for every login, expires, and stops working after sign-out', () => {
    process.env.COMMENT_ADMIN_PASSWORD = 'correct horse';
    const a = createCommentAdminSessionToken(0);
    const b = createCommentAdminSessionToken(0);
    expect(a).not.toBe(b);
    expect(isValidCommentAdminSession(a, 1000)).toBe(true);
    expect(isValidCommentAdminSession(a, 8 * 24 * 60 * 60 * 1000)).toBe(false);
    revokeCommentAdminSession(b, 1000);
    expect(isValidCommentAdminSession(b, 1000)).toBe(false);
    // the old cookie, a plain hash of the password, is no longer a session
    expect(isValidCommentAdminSession(createHash('sha256').update('correct horse::peaceakinwale-comments').digest('hex'), 1000)).toBe(false);
    expect(validateCommentAdminPassword('correct horse')).toBe(true);
    expect(validateCommentAdminPassword('')).toBe(false);
  });
});

describe('MyLinks', () => {
  it('links the anchor where it is in the live document, and skips one that is gone', () => {
    const live = 'Alpha one sentence.\n\nBeta two three four.';
    const { patches, skipped } = locateAnchors(live, [
      { id: 'a', anchor_text: 'two three', char_start: 25, char_end: 34, target_url: 'https://x/a' },
      { id: 'b', anchor_text: 'not here', char_start: 0, char_end: 8, target_url: 'https://x/b' },
    ]);
    expect(live.slice(patches[0].char_start, patches[0].char_end)).toBe('two three');
    expect(skipped).toEqual(['b']);
  });
  it('refuses private and non-web crawl addresses', async () => {
    for (const ip of ['127.0.0.1', '10.0.0.5', '169.254.169.254', '192.168.1.1', '::1', 'fd00::1', '::ffff:10.0.0.1']) expect(isPrivateAddress(ip)).toBe(true);
    expect(isPrivateAddress('93.184.216.34')).toBe(false);
    for (const url of ['http://127.0.0.1/', 'http://localhost:3000/', 'http://web.railway.internal/', 'file:///etc/passwd', 'https://example.com:8080/', 'http://[::1]/']) {
      await expect(assertPublicUrl(url)).rejects.toThrow();
    }
  });
  it('builds redirects from the host the browser asked for, never the container address', () => {
    const at = (host: string) => requestOrigin(new Request('https://localhost:8080/x', { headers: { host } }));
    expect(at('mylinks.peaceakinwale.com')).toBe('https://mylinks.peaceakinwale.com');
    expect(at('peaceakinwale.com')).toBe('https://peaceakinwale.com');
    expect(at('evil.example')).toBe('https://mylinks.peaceakinwale.com');
  });
  it('keeps the space in a styled run that holds only a space', () => {
    expect(normalizeRichTextHtml('<p><span>foo</span><span> </span><span>bar</span></p>').text).toBe('foo bar');
    expect(normalizeRichTextHtml('<p><b>x</b><i> </i><b>y</b></p>').text).toBe('x y');
  });
});

describe('image optimizer', () => {
  it('only optimizes local images and the listed hosts', () => {
    expect(skipOptimizer('/images/a.png')).toBe(false);
    expect(skipOptimizer('https://peaceakinwale.wordpress.com/a.png')).toBe(false);
    expect(skipOptimizer('https://i0.wp.com/a.png')).toBe(false);
    expect(skipOptimizer('https://www.wikipedia.org/a.png')).toBe(true);
    expect(skipOptimizer('https://evilwp.com/a.png')).toBe(true);
  });
});
