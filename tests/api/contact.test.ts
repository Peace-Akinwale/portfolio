// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn(function Resend() {
    return { emails: { send } };
  }),
}));

const { POST } = await import('@/app/api/contact/route');

const validBody = {
  name: 'Ada <b>Lovelace</b>',
  email: 'ada@example.com',
  company: 'Analytical',
  projectType: 'Content Refresh',
  stage: 'We have a content strategy and clear topics. We just need someone to write.',
  about: 'We make <script>engines</script>',
  message: '',
  budget: '',
};

const post = (body: unknown) =>
  POST(new Request('http://localhost/api/contact', { method: 'POST', body: JSON.stringify(body) }));

describe('POST /api/contact', () => {
  beforeEach(() => send.mockReset());

  it('reports failure when Resend returns an error instead of throwing', async () => {
    send.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'bad key' } });
    const res = await post(validBody);
    expect(res.status).toBe(502);
  });

  it('succeeds, sets reply-to, and escapes user input in the email', async () => {
    send.mockResolvedValue({ data: { id: 'email_1' }, error: null });
    const res = await post(validBody);
    expect(res.status).toBe(200);
    const payload = send.mock.calls[0][0];
    expect(payload.replyTo).toBe('ada@example.com');
    expect(payload.html).toContain('Ada &lt;b&gt;Lovelace&lt;/b&gt;');
    expect(payload.html).not.toContain('<script>');
  });

  it('rejects missing or invalid fields without calling Resend', async () => {
    expect((await post({})).status).toBe(400);
    expect((await post({ ...validBody, email: 'not-an-email' })).status).toBe(400);
    expect((await post({ ...validBody, name: '   ' })).status).toBe(400);
    expect((await post({ ...validBody, about: { unexpected: 'object' } })).status).toBe(400);
    expect((await post(null)).status).toBe(400);
    expect((await post({ ...validBody, message: 'x'.repeat(10001) })).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
});
