import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getYoutubeExplainers } from '@/lib/career-pathway/resources';
import { buildTranscriptSections } from '@/lib/career-pathway/transcript';
import type { Answers, ScoredCareer } from '@/lib/career-pathway/types';

function buildTranscriptHtml(answers: Answers): string {
  return buildTranscriptSections(answers)
    .map((section) => {
      const questionHtml = section.questions
        .map((question) => {
          const optionRows = question.options
            .map((option) => {
              const isSelected = question.selectedValues.includes(option.value);
              return isSelected
                ? `<li style="margin:3px 0;"><strong style="color:#111;">${option.label}</strong> (selected)</li>`
                : `<li style="margin:3px 0;color:#aaa;">${option.label}</li>`;
            })
            .join('');

          return `
            <div style="margin-bottom:16px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#555;">${question.text}</p>
              <ul style="list-style:none;padding:0;margin:0;font-size:13px;">${optionRows}</ul>
            </div>
          `;
        })
        .join('');

      return `
        <div style="margin-bottom:20px;">
          <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;">${section.title}</h3>
          ${questionHtml}
        </div>
      `;
    })
    .join('');
}

function buildCareerBlocks(
  results: ScoredCareer[],
  rankLabel: string[],
  sectionTitle: string,
  intro: string
): string {
  const careerBlocks = results
    .map((result, index) => {
      const career = result.career;
      const videoResources = getYoutubeExplainers(career.resources);
      const learningLinks = career.resources.learning
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
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${index === 0 ? '#0d9488' : '#9ca3af'};">${rankLabel[index]}</p>
          <h2 style="margin:4px 0 6px;font-size:20px;font-weight:800;">${career.title}</h2>
          <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">${career.subtitle}</p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">${career.whyItFitsFallback}</p>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
            <tr><td style="padding:6px 0;font-weight:600;width:40%;vertical-align:top;">Time to first income</td><td style="padding:6px 0;color:#374151;">${career.timeToFirstIncome.min}-${career.timeToFirstIncome.max} months</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;vertical-align:top;">What it costs to start</td><td style="padding:6px 0;color:#374151;">${career.requiresCertification ? `Free learning path, but ${career.certificationDetails ?? 'certification exam required'} to get hired` : 'Free - the entire learning path is free'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;vertical-align:top;">Entry requirement</td><td style="padding:6px 0;color:#374151;">${career.entryDescription}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;vertical-align:top;">AI reality</td><td style="padding:6px 0;color:#374151;">${career.aiRealityDescription}</td></tr>
          </table>

          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">A day in this role</p>
          <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#374151;">${career.dailyLifeDescription}</p>

          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">Income by region</p>
          <p style="margin:0 0 4px;font-size:13px;">US: $${career.incomeRanges.us.min.toLocaleString()}-$${career.incomeRanges.us.max.toLocaleString()}/yr entry</p>
          <p style="margin:0 0 4px;font-size:13px;">UK: GBP ${career.incomeRanges.uk.min.toLocaleString()}-GBP ${career.incomeRanges.uk.max.toLocaleString()}/yr entry</p>
          <p style="margin:0 0 16px;font-size:13px;">Global remote: $${career.incomeRanges.global_remote.min.toLocaleString()}-$${career.incomeRanges.global_remote.max.toLocaleString()}/yr</p>

          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">Start here (15 minutes)</p>
          <p style="margin:0 0 12px;font-size:13px;"><a href="${career.resources.startHere.url}" style="color:#0d9488;font-weight:600;">${career.resources.startHere.title}</a></p>

          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;">Keep going</p>
          <ul style="padding-left:16px;margin:0 0 16px;font-size:13px;line-height:1.8;">${learningLinks}${videoLinks}</ul>

          <div style="background:#f9fafb;border-radius:8px;padding:14px;font-size:13px;line-height:1.6;">
            <strong>Honest note: </strong>${career.honestCaveat}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <h2 style="font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#888;margin:0 0 8px;">${sectionTitle}</h2>
    <p style="margin:0 0 16px;color:#555;font-size:14px;line-height:1.6;">${intro}</p>
    ${careerBlocks}
  `;
}

function buildEmailHtml(name: string, results: ScoredCareer[], moatResults: ScoredCareer[], answers: Answers): string {
  const startNowSection = buildCareerBlocks(
    results,
    ['Best Fit', 'Best Alternative', 'Worth Exploring', 'Worth Exploring'],
    'Best path to start now',
    'These matches respect your current timeline, constraints, and the fastest realistic path to getting paid.'
  );
  const moatSection = moatResults.length
    ? buildCareerBlocks(
        moatResults,
        ['Long-Term Moat', 'Moat Alternative', 'Worth Building Toward', 'Worth Building Toward'],
        'Stronger long-term moat path',
        'These options are tougher and slower to ramp into, but they are generally more defensible if you can handle a longer learning curve.'
      )
    : '';

  return `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;color:#111;">
      <h2 style="font-size:22px;margin:0 0 8px;">Hi ${name || 'there'},</h2>
      <p style="color:#555;margin:0 0 24px;">Here are your Career Pathway results.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">
      ${startNowSection}
      ${moatSection ? `<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">${moatSection}` : ''}
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
    const { email, name, results, moatResults, answers } = body as {
      email?: string;
      name?: string;
      results?: ScoredCareer[];
      moatResults?: ScoredCareer[];
      answers?: Answers;
    };

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
      html: buildEmailHtml(name ?? '', results, moatResults ?? [], answers ?? {}),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/email]', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
