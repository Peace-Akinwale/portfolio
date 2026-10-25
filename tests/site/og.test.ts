import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ogImagePath, withOg } from '@/lib/og';

describe('per-page social images', () => {
  it('never points at a file that is not there', () => {
    expect(ogImagePath('does-not-exist')).toBeNull();
    const meta = withOg({ title: 'T', description: 'D' }, { key: 'does-not-exist', path: '/x', alt: 'a' });
    expect(JSON.stringify(meta.openGraph)).toContain('/opengraph-image');
    expect(JSON.stringify(meta.openGraph)).not.toContain('/og/does-not-exist');
    expect(meta.openGraph?.url).toBe('https://peaceakinwale.com/x');
  });

  it('uses public/og/<key>.png when it exists, at 1200x630', () => {
    const dir = path.join(process.cwd(), 'public', 'og');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.png')) : [];
    for (const f of files) {
      const key = f.replace(/\.png$/, '');
      expect(ogImagePath(key)).toBe(`/og/${key}.png`);
      const buf = fs.readFileSync(path.join(dir, f));
      expect([buf.readUInt32BE(16), buf.readUInt32BE(20)], f).toEqual([1200, 630]);
    }
  });
});
