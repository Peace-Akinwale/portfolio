import { describe, expect, it } from 'vitest';
import { GateNotInstalled, decideListed } from './allowlist';

describe('decideListed', () => {
  it('is false for an empty email without asking the database', async () => {
    let asked = false;
    const listed = await decideListed('  ', async () => { asked = true; return true; });
    expect(listed).toBe(false);
    expect(asked).toBe(false);
  });

  it('lower-cases and trims before asking', async () => {
    let seen = '';
    await decideListed('  Peace@Example.com ', async (email) => { seen = email; return true; });
    expect(seen).toBe('peace@example.com');
  });

  it('fails open only when the gate is not installed yet', async () => {
    const listed = await decideListed('a@b.co', async () => { throw new GateNotInstalled('PGRST202'); });
    expect(listed).toBe(true);
  });

  it('fails closed when the database call throws', async () => {
    const listed = await decideListed('a@b.co', async () => { throw new Error('down'); });
    expect(listed).toBe(false);
  });
});
