import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getYoutubeExplainers } from '@/lib/career-pathway/resources';
import { buildTranscriptSections } from '@/lib/career-pathway/transcript';
import type { Answers, ScoredCareer } from '@/lib/career-pathway/types';
import { CAREERS } from '@/lib/career-pathway/careers';
import { allow, clientIp, EMAIL_PATTERN } from '@/lib/rate-limit';

function escapeHtml(input: string) {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// The browser sends back the results it was shown, but only the career ids are
// read from it: every word and link in the email comes from this site's own
// career list, so the endpoint cannot be used to send someone else's content.
function trustedResults(input: unknown): ScoredCareer[] {
  if (!Array.isArray(input)) return [];
  const out: ScoredCareer[] = [];
  for (const item of input.slice(0, 4)) {
    const id = (item as { career?: { id?: unknown } } | null)?.career?.id;
    const career = typeof id === 'string' ? CAREERS.find((c) => c.id === id) : undefined;
    if (!career || out.some((r) => r.career.id === career.id)) continue;
    const score = Number((item as { score?: unknown }).score);
    out.push({ career, score: Number.isFinite(score) ? score : 0, rank: (out.length + 1) as ScoredCareer['rank'] });
  }
  return out;
}

function trustedAnswers(input: unknown): Answers {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return {};
  const out: Answers = {};
  for (const [key, value] of Object.entries(input).slice(0, 60)) {
    if (typeof value === 'string' && value.length <= 100) out[key] = value;
    else if (Array.isArray(value) && value.length <= 20 && value.every((v) => typeof v === 'string' && v.length <= 100)) out[key] = value;
  }
  return out;
}

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
    if (!allow(`cp-email:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many emails requested. Try again later.' }, { status: 429 });
    }
    const raw = await req.text();
    if (raw.length > 400_000) {
      return NextResponse.json({ error: 'That request is too large.' }, { status: 413 });
    }
    const body = JSON.parse(raw);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : '';
    const results = trustedResults(body?.results);
    const moatResults = trustedResults(body?.moatResults);
    const answers = trustedAnswers(body?.answers);

    if (!email || results.length === 0) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    // One recipient cannot be mailed repeatedly, whoever is asking.
    if (!allow(`cp-email-to:${email.toLowerCase()}`, 3, 24 * 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Those results were already sent to that address.' }, { status: 429 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const subjectName = name.replace(/[\r\n]+/g, ' ');

    // Resend returns { data, error } instead of throwing, so the error is checked.
    const { error } = await resend.emails.send({
      from: 'peace@peaceakinwale.com',
      to: email,
      replyTo: process.env.ADMIN_EMAIL!,
      subject: `${subjectName ? `${subjectName}, your` : 'Your'} Career Pathway results`,
      html: buildEmailHtml(escapeHtml(name), results, moatResults, answers),
    });
    if (error) {
      console.error('[career-pathway/email] Resend rejected the send', error);
      return NextResponse.json({ error: 'The email could not be sent. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/email]', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
