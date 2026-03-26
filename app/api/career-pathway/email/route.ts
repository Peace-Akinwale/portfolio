import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { QUESTIONS } from '@/lib/career-pathway/questions';
import { getYoutubeExplainers } from '@/lib/career-pathway/resources';
import type { ScoredCareer } from '@/lib/career-pathway/types';

function buildTranscriptHtml(answers: Record<string, string | string[]>): string {
  const answeredIds = new Set(Object.keys(answers));
  const relevantQuestions = QUESTIONS.filter((q) => answeredIds.has(q.id));

  return relevantQuestions
    .map((q) => {
      const userAnswer = answers[q.id];
      const selectedValues = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

      const optionRows = q.options
        .map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return isSelected
            ? `<li style="margin:3px 0;"><strong style="color:#111;">${opt.label}</strong> (selected)</li>`
            : `<li style="margin:3px 0;color:#aaa;">${opt.label}</li>`;
        })
        .join('');

      return `
      <div style="margin-bottom:16px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#555;">${q.text}</p>
        <ul style="list-style:none;padding:0;margin:0;font-size:13px;">${optionRows}</ul>
      </div>
    `;
    })
    .join('');
}

function buildEmailHtml(name: string, results: ScoredCareer[], answers: Record<string, string | string[]>): string {
  const rankLabel = ['Best Fit', 'Strong Alternate', 'Worth Exploring', 'Worth Exploring'];

  const careerBlocks = results
    .map((r, i) => {
      const c = r.career;
      const videoResources = getYoutubeExplainers(c.resources);
      const learningLinks = c.resources.learning
        .map(
          (resource) =>
            `<li style="margin:4px 0;"><a href="${resource.url}" style="color:#0d9488;">${resource.title}</a> - ${resource.description}</li>`
        )
        .join('');
      const videoLinks = videoResources
        .map(
          (video) =>
            `<li style="margin:4px 0;"><a href="${video.url}" style="color:#0d9488;">Video: ${video.title}</a> - ${video.description}</li>`
        )
        .join('');

      return `
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${i === 0 ? '#0d9488' : '#9ca3af'};">${rankLabel[i]}</p>
      <h2 style="margin:4px 0 6px;font-size:20px;font-weight:800;">${c.title}</h2>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">${c.subtitle}</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">${c.whyItFitsFallback}</p>

      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
        <tr><td style="padding:6px 0;font-weight:600;width:40%;vertical-align:top;">Time to first income</td><td style="padding:6px 0;color:#374151;">${c.timeToFirstIncome.min}-${c.timeToFirstIncome.max} months</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;vertical-align:top;">What it costs to start</td><td style="padding:6px 0;color:#374151;">${c.requiresCertification ? `Free learning path, but ${c.certificationDetails ?? 'certification exam required'} to get hired` : 'Free - the entire learning path is free'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;vertical-align:top;">Entry requirement</td><td style="padding:6px 0;color:#374151;">${c.entryDescription}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;vertical-align:top;">AI reality</td><td style="padding:6px 0;color:#374151;">${c.aiRealityDescription}</td></tr>
      </table>

      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">A day in this role</p>
      <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#374151;">${c.dailyLifeDescription}</p>

      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">Income by region</p>
      <p style="margin:0 0 4px;font-size:13px;">US: $${c.incomeRanges.us.min.toLocaleString()}-$${c.incomeRanges.us.max.toLocaleString()}/yr entry</p>
      <p style="margin:0 0 4px;font-size:13px;">UK: GBP ${c.incomeRanges.uk.min.toLocaleString()}-GBP ${c.incomeRanges.uk.max.toLocaleString()}/yr entry</p>
      <p style="margin:0 0 16px;font-size:13px;">Global remote: $${c.incomeRanges.global_remote.min.toLocaleString()}-$${c.incomeRanges.global_remote.max.toLocaleString()}/yr</p>

      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">Start here (15 minutes)</p>
      <p style="margin:0 0 12px;font-size:13px;"><a href="${c.resources.startHere.url}" style="color:#0d9488;font-weight:600;">${c.resources.startHere.title}</a></p>

      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">Keep going</p>
      <ul style="padding-left:16px;margin:0 0 16px;font-size:13px;line-height:1.8;">${learningLinks}${videoLinks}</ul>

      <div style="background:#f9fafb;border-radius:8px;padding:14px;font-size:13px;line-height:1.6;">
        <strong>Honest note: </strong>${c.honestCaveat}
      </div>
    </div>
  `;
    })
    .join('');

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
        This assessment was built using data from <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" style="color:#888;">WEF Future of Jobs Report 2025</a>, <a href="https://www.bls.gov/ooh/" style="color:#888;">Bureau of Labor Statistics</a>, <a href="https://www.linkedin.com/pulse/linkedin-jobs-rise-2025-25-fastest-growing-roles-us-linkedin-news/" style="color:#888;">LinkedIn Jobs on the Rise</a>, and <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai" style="color:#888;">McKinsey AI displacement research</a>.<br><br>
        It's a starting point - not a final answer. Take the first step within the next 48 hours.<br><br>
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

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'peace@peaceakinwale.com',
      to: email,
      replyTo: process.env.ADMIN_EMAIL!,
      subject: `${name ? `${name}, your` : 'Your'} Career Pathway results`,
      html: buildEmailHtml(name ?? '', results, answers ?? {}),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/email]', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
