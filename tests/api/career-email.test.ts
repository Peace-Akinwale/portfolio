// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CAREERS } from '@/lib/career-pathway/careers';
import { resetRateLimits } from '@/lib/rate-limit';

const send = vi.fn();
vi.mock('resend', () => ({ Resend: vi.fn(function Resend() { return { emails: { send } }; }) }));

const { POST } = await import('@/app/api/career-pathway/email/route');
const post = (body: unknown, ip = '203.0.113.9') =>
  POST(new Request('http://localhost/api/career-pathway/email', { method: 'POST', headers: { 'x-real-ip': ip }, body: JSON.stringify(body) }));

const real = CAREERS[0];
const forged = { career: { ...real, title: '<a href="https://evil.example">Reset your password</a>', resources: { startHere: { url: 'https://evil.example', title: 'x' }, learning: [] } }, score: 50, rank: 1 };

describe('POST /api/career-pathway/email', () => {
  beforeEach(() => { send.mockReset(); send.mockResolvedValue({ data: { id: '1' }, error: null }); resetRateLimits(); });

  it('builds the email from the site career list, not from the request', async () => {
    const res = await post({ email: 'reader@example.com', name: '<img src=x onerror=1>', results: [forged] });
    expect(res.status).toBe(200);
    const mail = send.mock.calls[0][0];
    expect(mail.html).not.toContain('evil.example');
    expect(mail.html).not.toContain('<img src=x');
    expect(mail.html).toContain(real.title);
  });

  it('rejects results that name no real career', async () => {
    const res = await post({ email: 'reader@example.com', results: [{ career: { id: 'made-up', title: 'x' } }] });
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('reports failure when Resend returns an error instead of throwing', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'quota' } });
    const res = await post({ email: 'reader@example.com', results: [{ career: { id: real.id } }] });
    expect(res.status).toBe(502);
  });

  it('stops repeated sends to one address and from one sender', async () => {
    const body = (to: string) => ({ email: to, results: [{ career: { id: real.id } }] });
    for (let i = 0; i < 3; i += 1) expect((await post(body('one@example.com'), `198.51.100.${i}`)).status).toBe(200);
    expect((await post(body('one@example.com'), '198.51.100.77')).status).toBe(429);
    resetRateLimits();
    for (let i = 0; i < 5; i += 1) expect((await post(body(`p${i}@example.com`))).status).toBe(200);
    expect((await post(body('p9@example.com'))).status).toBe(429);
  });
});
