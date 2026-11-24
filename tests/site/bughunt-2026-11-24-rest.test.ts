// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { openToken, sealToken } from '@/lib/mylinks/google-tokens';

describe('Google token storage', () => {
  it('stores tokens encrypted and still reads the plain ones saved before', () => {
    process.env.MYLINKS_TOKEN_KEY = 'test-key';
    const sealed = sealToken('ya29.secret-token');
    expect(sealed).not.toContain('ya29');
    expect(sealed.startsWith('enc:v1:')).toBe(true);
    expect(sealToken('ya29.secret-token')).not.toBe(sealed);
    expect(openToken(sealed)).toBe('ya29.secret-token');
    expect(openToken('1//legacy-plain-refresh')).toBe('1//legacy-plain-refresh');
    expect(sealToken(sealed)).toBe(sealed);
    process.env.MYLINKS_TOKEN_KEY = 'another-key';
    expect(() => openToken(sealed)).toThrow();
  });
  it('does not encrypt, and does not lock anyone out, when the key is missing', () => {
    delete process.env.MYLINKS_TOKEN_KEY;
    expect(sealToken('plain')).toBe('plain');
    expect(openToken('plain')).toBe('plain');
  });
});
