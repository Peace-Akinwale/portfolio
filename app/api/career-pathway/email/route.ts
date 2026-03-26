// app/api/career-pathway/email/route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import type { ScoredCareer } from '@/lib/career-pathway/types';
import { QUESTIONS } from '@/lib/career-pathway/questions';

function buildTranscriptHtml(answers: Record<string, string | string[]>): string {
  const answeredIds = new Set(Object.keys(answers));
  const relevantQuestions = QUESTIONS.filter((q) => answeredIds.has(q.id));

  return relevantQuestions.map((q) => {
    const userAnswer = answers[q.id];
    const selectedValues = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

    const optionRows = q.options.map((opt) => {
      const isSelected = selectedValues.includes(opt.value);
      return isSelected
        ? `<li style="margin:3px 0;"><strong style="color:#111;">${opt.label}</strong> ✓</li>`
        : `<li style="margin:3px 0;color:#aaa;">${opt.label}</li>`;
    }).join('');

    return `
      <div style="margin-bottom:16px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#555;">${q.text}</p>
        <ul style="list-style:none;padding:0;margin:0;font-size:13px;">${optionRows}</ul>
      </div>
    `;
  }).join('');
}

function buildEmailHtml(name: string, results: ScoredCareer[], answers: Record<string, string | string[]>): string {
  const rankLabel = ['Best Fit', 'Strong Alternate', 'Worth Exploring', 'Worth Exploring'];

  const careerBlocks = results.map((r, i) => `
    <h3 style="margin:0 0 4px;">${i + 1}. ${r.career.title} — ${rankLabel[i]}</h3>
    <p style="margin:0 0 8px;">${r.career.whyItFitsFallback}</p>
    <p style="margin:0 0 4px;"><strong>Time to first income:</strong> ${r.career.timeToFirstIncome.min}–${r.career.timeToFirstIncome.max} months</p>
    <p style="margin:0 0 16px;"><strong>Start here:</strong> <a href="${r.career.resources.startHere.url}">${r.career.resources.startHere.title}</a></p>
  `).join('');

  return `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;color:#111;">
      <h2 style="font-size:22px;margin:0 0 8px;">Hi ${name || 'there'},</h2>
      <p style="color:#555;margin:0 0 24px;">Here are your Career Pathway results.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">
      <h2 style="font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#888;margin:0 0 16px;">Your Top Matches</h2>
      ${careerBlocks}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <h2 style="font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#888;margin:0 0 12px;">Your Answers</h2>
      ${buildTranscriptHtml(answers)}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="font-size:12px;color:#888;line-height:1.6;">
        This assessment was built using data from the World Economic Forum Future of Jobs Report 2025, Bureau of Labor Statistics, LinkedIn Jobs on the Rise, and career development research.<br><br>
        It's a starting point — not a final answer. Take the first step within the next 48 hours.<br><br>
        <strong>Peace Akinwale</strong><br>
        <a href="https://peaceakinwale.com" style="color:#888;">peaceakinwale.com</a>
      </p>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, results, answers } = body;

    if (!email || !results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Peace Akinwale" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `${name ? name + ', your' : 'Your'} Career Pathway results`,
      html: buildEmailHtml(name ?? '', results, answers ?? {}),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/email]', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
