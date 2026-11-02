import { describe, expect, it } from 'vitest';
import { GateNotInstalled, askAllowlist, decideListed } from './allowlist';

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

describe('askAllowlist', () => {
  it('is true only when Postgres answers true', async () => {
    expect(await askAllowlist('a@b.co', async () => ({ data: true, error: null }))).toBe(true);
    expect(await askAllowlist('a@b.co', async () => ({ data: false, error: null }))).toBe(false);
    expect(await askAllowlist('a@b.co', async () => ({ data: null, error: null }))).toBe(false);
  });

  it('throws GateNotInstalled when the function is missing', async () => {
    await expect(
      askAllowlist('a@b.co', async () => ({ data: null, error: { code: 'PGRST202', message: 'Could not find the function' } }))
    ).rejects.toBeInstanceOf(GateNotInstalled);
  });

  it('answers false on any other database error', async () => {
    expect(await askAllowlist('a@b.co', async () => ({ data: null, error: { code: '500', message: 'down' } }))).toBe(false);
  });
});
