// lib/career-pathway/storage.ts

interface StoredValue<T> {
  data: T;
  expiresAt: string;
}

export function storageWrite<T>(key: string, data: T, ttlMs: number): void {
  if (typeof window === 'undefined') return;
  const value: StoredValue<T> = {
    data,
    expiresAt: new Date(Date.now() + ttlMs).toISOString(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail (private browsing / storage full)
  }
}

export function storageRead<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const stored: StoredValue<T> = JSON.parse(raw);
    if (new Date(stored.expiresAt).getTime() < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return stored.data;
  } catch {
    return null;
  }
}

export function storageClear(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export function storageClearAll(keys: string[]): void {
  keys.forEach(storageClear);
}
