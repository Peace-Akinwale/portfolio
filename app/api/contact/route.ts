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
    const body = await req.json();
    const { name, email, company, projectType, stage, about, message, budget } = body;

    if (!name || !email || !projectType || !stage || !about || !EMAIL_PATTERN.test(String(email))) {
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
        <p><strong>Stage:</strong> ${e(stage)}</p>
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
