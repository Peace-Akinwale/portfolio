import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { name, email, company, projectType, stage, about, message, budget } = body;

    await resend.emails.send({
      from: 'peace@peaceakinwale.com',
      to: process.env.ADMIN_EMAIL!,
      subject: `New enquiry from ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || '—'}</p>
        <p><strong>Project type:</strong> ${projectType}</p>
        <p><strong>Stage:</strong> ${stage}</p>
        <p><strong>About the company:</strong><br/>${about}</p>
        <p><strong>Message:</strong><br/>${message || '—'}</p>
        <p><strong>Budget:</strong> ${budget || '—'}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
