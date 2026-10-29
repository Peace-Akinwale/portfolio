import { describe, expect, it } from 'vitest';
import { generateNonce, sha256Hex } from './google-identity';

describe('nonce contract for Google Identity Services', () => {
  it('makes a 64-character hex nonce, different each time', () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });

  it('hashes with SHA-256 as hex, which is what Google echoes back', async () => {
    // echo -n abc | shasum -a 256
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});
