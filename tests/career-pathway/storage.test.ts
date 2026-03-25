// tests/career-pathway/storage.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageWrite, storageRead, storageClear } from '../../lib/career-pathway/storage';

const MOCK_KEY = 'test-key';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('storageWrite / storageRead', () => {
  it('writes and reads back data with TTL stamped', () => {
    const data = { name: 'Amara', score: 42 };
    storageWrite(MOCK_KEY, data, 60_000);
    const result = storageRead<typeof data>(MOCK_KEY);
    expect(result).toEqual(data);
  });

  it('returns null for a missing key', () => {
    expect(storageRead('no-such-key')).toBeNull();
  });

  it('returns null and removes key when TTL has expired', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValueOnce(now).mockReturnValue(now + 10);
    storageWrite(MOCK_KEY, { x: 1 }, 1);
    const result = storageRead(MOCK_KEY);
    expect(result).toBeNull();
    expect(localStorage.getItem(MOCK_KEY)).toBeNull();
  });
});

describe('storageClear', () => {
  it('removes the specified key', () => {
    storageWrite(MOCK_KEY, { x: 1 }, 60_000);
    storageClear(MOCK_KEY);
    expect(localStorage.getItem(MOCK_KEY)).toBeNull();
  });
});
