'use client';

import { useState } from 'react';

const PROJECT_TYPES = [
  'Select a type',
  'Long-form TOFU article',
  'MOFU article',
  'BOFU / Comparison article',
  'Content Refresh',
  'Monthly Retainer',
  'AI Systems / Workflow Automation',
  'eBook',
  'Other',
];

const BUDGETS = [
  'Select a range',
  'Under $1,000',
  '$1,000–$3,000',
  '$3,000–$5,000',
  '$5,000+',
];

const BUILDING_TYPE = 'AI Systems / Workflow Automation';

// The stage options follow the service picked: a building client was being asked
// about content strategy (review, 29 Oct 2026).
const WRITING_STAGES = [
  'We have a content strategy and clear topics. All we need is someone to write.',
  'We have a content strategy but aren\'t confident about the keywords and topics to prioritize.',
  'We don\'t have a content strategy yet and need help building one.',
];

const BUILDING_STAGES = [
  'We know the task we want a tool for.',
  'We repeat a process every week and want to know whether a tool would help.',
  'We have a tool that doesn\'t work the way the team needs.',
];

const inputClass = 'w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent transition';
const labelClass = 'text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '',
    projectType: '', stage: '', about: '',
    message: '', budget: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // A stage picked for writing doesn't apply to building, so a change of service clears it.
    const next = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'projectType' && e.target.value !== form.projectType) next.stage = '';
    setForm(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="gutter mx-auto max-w-[1180px] py-14 sm:py-20">
      <div className="max-w-3xl mx-auto">

      {/* ── Header ─────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
          Say hi
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-foreground leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Let&rsquo;s talk about it.
          </h1>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground mt-4 max-w-lg">
          Grab a free 30-minute call below. No pressure, it&rsquo;s a chat. Or scroll down and send me a message instead.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground mt-2 max-w-lg">
          Or email me at <a href="mailto:akindayopeaceakinwale@gmail.com" className="underline underline-offset-2 text-foreground">akindayopeaceakinwale@gmail.com</a>
        </p>
      </div>

      {/* ── Calendly embed ─────────────────────────── */}
      {/* On phones the inline embed is cramped (cookie banner on top, scrolling inside a scroll),
          so small screens get a direct link to the same Calendly page instead. */}
      <a
        href="https://calendly.com/akindayopeaceakinwale/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden flex w-full items-center justify-center py-4 mb-16 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90"
        style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
      >
        Pick a time on Calendly
      </a>
      <div className="hidden sm:block rounded-xl border border-border overflow-hidden mb-16" style={{ background: 'var(--muted)' }}>
        <iframe
          loading="lazy"
          src="https://calendly.com/akindayopeaceakinwale/30min?embed_domain=peaceakinwale.com&embed_type=Inline"
          width="100%"
          height="680"
          frameBorder="0"
          title="Book a 30-minute call with Peace on Calendly"
          className="w-full"
        />
        <p className="px-4 py-3 text-[14px] text-muted-foreground">
          If the calendar doesn’t load,{' '}
          <a href="https://calendly.com/akindayopeaceakinwale/30min" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">open it on Calendly</a>.
        </p>
      </div>

      {/* ── Divider ────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-12">
        <span className="flex-1 h-px bg-border" />
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
          Rather write first?
        </p>
        <span className="flex-1 h-px bg-border" />
      </div>

      {/* ── Form ───────────────────────────────────── */}
      {status === 'sent' ? (
        <div className="flex flex-col gap-4 py-10">
          <p className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>Message sent.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">Thanks for writing. I&rsquo;ll get back to you within a business day.</p>
          <button
            onClick={() => { setStatus('idle'); setForm({ name: '', email: '', company: '', projectType: '', stage: '', about: '', message: '', budget: '' }); }}
            className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-2 mt-2 self-start"
            style={{ color: 'var(--accent)' }}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className={labelClass}>Full Name <span style={{ color: 'var(--accent)' }}>*</span></label>
              <input id="contact-name" name="name" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>Work Email <span style={{ color: 'var(--accent)' }}>*</span></label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="contact-company" className={labelClass}>Company</label>
            <input id="contact-company" name="company" autoComplete="organization" value={form.company} onChange={handleChange} placeholder="Your company name" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-project-type" className={labelClass}>Type of project <span style={{ color: 'var(--accent)' }}>*</span></label>
              <select id="contact-project-type" name="projectType" required value={form.projectType} onChange={handleChange} className={inputClass}>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t === 'Select a type' ? '' : t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="contact-budget" className={labelClass}>Budget per project</label>
              <select id="contact-budget" name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
                {BUDGETS.map((b) => (
                  <option key={b} value={b === 'Select a range' ? '' : b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contact-stage" className={labelClass}>Where are you in the process? <span style={{ color: 'var(--accent)' }}>*</span></label>
            <select id="contact-stage" name="stage" required value={form.stage} onChange={handleChange} className={inputClass}>
              <option value="">Select a stage</option>
              {(form.projectType === BUILDING_TYPE ? BUILDING_STAGES : WRITING_STAGES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-about" className={labelClass}>Tell me about your company <span style={{ color: 'var(--accent)' }}>*</span></label>
            <textarea id="contact-about" name="about" required value={form.about} onChange={handleChange} rows={3} placeholder="What you do and who you serve..." className={inputClass + ' resize-none'} />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>Anything else</label>
            <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Anything else you'd like me to know..." className={inputClass + ' resize-none'} />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-500">Something went wrong. Try emailing me at <a href="mailto:akindayopeaceakinwale@gmail.com" className="underline">akindayopeaceakinwale@gmail.com</a></p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
          >
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}
      </div>
    </div>
  );
}
