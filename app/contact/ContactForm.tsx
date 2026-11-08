'use client';

import { useState } from 'react';

// The options match what the services page sells (3 Nov 2026 review: the form
// offered TOFU, MOFU and eBooks that services excludes, and a tool buyer had one
// vague option and no honest answer to the stage question).
const PROJECT_TYPES = [
  'Select a type',
  'A new article or an article refresh',
  'Articles each month',
  'SEO or AEO consulting',
  'An AI workflow or automation',
  'Something else',
];

const BUDGETS = [
  'Select a range',
  'Under $1,000',
  '$1,000–$3,000',
  '$3,000–$8,000',
  '$8,000 or more',
];

const BUILDING_TYPE = 'An AI workflow or automation';

// The stage options follow the service picked: a building client was being asked
// about content strategy (review, 29 Oct 2026).
const WRITING_STAGES = ["We have a brief and need a writer.", "We have a strategy and need help choosing topics.", "We need help developing the strategy."];

const BUILDING_STAGES = ["We know the task we want to automate.", "We have an idea and need help developing it.", "We want help finding what we could automate."];

// Design guide, 4 Nov 2026: inputs need a 3:1 edge (--control-border), 16px text, and a visible focus ring;
// labels use one cue (weight), not capitals, tracking, weight and grey at once.
const inputClass = 'w-full rounded-md border border-[var(--control-border)] bg-background px-4 py-2.5 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition';
const labelClass = 'text-[15px] font-semibold text-foreground mb-1.5 block';

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
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-foreground">Tell me what you’re working on</h1>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground mt-4 max-w-lg">
          Tell me about the content you need, something you want to automate, or an idea you haven’t had time to develop. You don’t need a finished brief to start the conversation.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground mt-2 max-w-lg">
          The first 30-minute call is free. Further calls are paid consultations, with the fee agreed before booking. You can also email me at <a href="mailto:akindayopeaceakinwale@gmail.com" className="underline underline-offset-2 text-foreground">akindayopeaceakinwale@gmail.com</a>
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
        <p className="px-4 py-3 text-[14px] text-muted-foreground">
          If the calendar doesn’t load,{' '}
          <a href="https://calendly.com/akindayopeaceakinwale/30min" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">open it on Calendly</a>.
        </p>
        <iframe
          loading="lazy"
          src="https://calendly.com/akindayopeaceakinwale/30min?embed_domain=peaceakinwale.com&embed_type=Inline"
          width="100%"
          height="680"
          frameBorder="0"
          title="Book a 30-minute call with Peace on Calendly"
          className="w-full"
        />
      </div>

      {/* ── Divider ────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-12">
        <span className="flex-1 h-px bg-border" />
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
          Send a message
        </p>
        <span className="flex-1 h-px bg-border" />
      </div>

      {/* ── Form ───────────────────────────────────── */}
      {status === 'sent' ? (
        <div className="flex flex-col gap-4 py-10">
          <p role="status" className="text-2xl font-semibold text-foreground">Message sent.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">Thanks for writing. I’ll reply within a business day.</p>
          <button
            onClick={() => { setStatus('idle'); setForm({ name: '', email: '', company: '', projectType: '', stage: '', about: '', message: '', budget: '' }); }}
            className="button button-line mt-2 self-start"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <p className="text-[14px] text-muted-foreground">Fields marked * are required.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className={labelClass}>Name <span aria-hidden="true">*</span></label>
              <input id="contact-name" name="name" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>Email <span aria-hidden="true">*</span></label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="contact-company" className={labelClass}>Company</label>
            <input id="contact-company" name="company" autoComplete="organization" value={form.company} onChange={handleChange} placeholder="Your company name" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-project-type" className={labelClass}>What do you need? <span aria-hidden="true">*</span></label>
              <select id="contact-project-type" name="projectType" required value={form.projectType} onChange={handleChange} className={inputClass}>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t === 'Select a type' ? '' : t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="contact-budget" className={labelClass}>Budget in USD, per article or project</label>
              <select id="contact-budget" name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
                {BUDGETS.map((b) => (
                  <option key={b} value={b === 'Select a range' ? '' : b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contact-stage" className={labelClass}>Where are you with the work?</label>
            <select id="contact-stage" name="stage" value={form.stage} onChange={handleChange} className={inputClass}>
              <option value="">Select a stage</option>
              {(form.projectType === BUILDING_TYPE ? BUILDING_STAGES : WRITING_STAGES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-about" className={labelClass}>What would you like to write, automate or build? <span aria-hidden="true">*</span></label>
            <textarea id="contact-about" name="about" required value={form.about} onChange={handleChange} rows={3} placeholder="The product or the task, and who it is for" className={inputClass + ' resize-none'} />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>Anything else I should know?</label>
            <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Anything else you'd like me to know..." className={inputClass + ' resize-none'} />
          </div>

          {status === 'error' && (
            <p role="alert" className="text-[15px]" style={{ color: 'var(--danger)' }}>Your message didn&rsquo;t send. What you typed is still here. Try again, or email me at <a href="mailto:akindayopeaceakinwale@gmail.com" className="underline">akindayopeaceakinwale@gmail.com</a>.</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="button button-accent w-full disabled:opacity-60"
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? 'Sending your message…' : 'Send message'}
          </button>
        </form>
      )}
      </div>
    </div>
  );
}
