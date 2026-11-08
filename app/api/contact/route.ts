import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown>;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 });
    }
    const { name, email, company, projectType, stage, about, message, budget } = body;

    const required = [name, email, projectType, about];
    const optional = [company, stage, message, budget];
    if (required.some((value) => typeof value !== 'string' || !value.trim() || value.length > 10000)
      || optional.some((value) => value != null && (typeof value !== 'string' || value.length > 10000))
      || typeof email !== 'string' || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const e = escapeHtml;

    // Resend returns { data, error } instead of throwing, so the error has to be checked here.
    const { error } = await resend.emails.send({
      from: 'peace@peaceakinwale.com',
      to: process.env.ADMIN_EMAIL!,
      replyTo: String(email),
      subject: `New enquiry from ${String(name).slice(0, 120)}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${e(name)}</p>
        <p><strong>Email:</strong> ${e(email)}</p>
        <p><strong>Company:</strong> ${e(company) || '—'}</p>
        <p><strong>Project type:</strong> ${e(projectType)}</p>
        <p><strong>Stage:</strong> ${e(stage || 'not given')}</p>
        <p><strong>About the company:</strong><br/>${e(about)}</p>
        <p><strong>Message:</strong><br/>${e(message) || '—'}</p>
        <p><strong>Budget:</strong> ${e(budget) || '—'}</p>
      `,
    });

    if (error) {
      console.error('Resend rejected contact email:', error);
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
