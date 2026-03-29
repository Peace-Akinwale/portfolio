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

const STAGES = [
  'Where are you in the process?',
  'We have a content strategy and clear topics. We just need someone to write.',
  'We have a content strategy but aren\'t confident about the keywords and topics to prioritize.',
  'We don\'t have a content strategy yet and need help building one.',
];

const inputClass = 'w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent transition';
const labelClass = 'text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', company: '',
    projectType: '', stage: '', about: '',
    message: '', budget: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto">

      {/* ── Header ─────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
          Get in touch
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-foreground leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Let&rsquo;s work together.
          </h1>
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground whitespace-nowrap self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Currently accepting 2 new clients
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground mt-4 max-w-lg">
          Book a free 30-minute discovery call below. No commitment, no pressure. Or scroll down to send a message instead.
        </p>
      </div>

      {/* ── Calendly embed ─────────────────────────── */}
      <div className="rounded-xl border border-border overflow-hidden mb-16" style={{ background: 'var(--muted)' }}>
        <iframe
          src="https://calendly.com/akindayopeaceakinwale/30min?embed_domain=peaceakinwale.com&embed_type=Inline"
          width="100%"
          height="680"
          frameBorder="0"
          className="w-full"
        />
      </div>

      {/* ── Divider ────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-12">
        <span className="flex-1 h-px bg-border" />
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
          Prefer to write first?
        </p>
        <span className="flex-1 h-px bg-border" />
      </div>

      {/* ── Form ───────────────────────────────────── */}
      {status === 'sent' ? (
        <div className="flex flex-col gap-4 py-10">
          <p className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>Message sent.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">Thanks for reaching out. I&rsquo;ll get back to you within one business day.</p>
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
              <label className={labelClass}>Full Name <span style={{ color: 'var(--accent)' }}>*</span></label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Work Email <span style={{ color: 'var(--accent)' }}>*</span></label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Company</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="Your company name" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Type of project <span style={{ color: 'var(--accent)' }}>*</span></label>
              <select name="projectType" required value={form.projectType} onChange={handleChange} className={inputClass}>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t === 'Select a type' ? '' : t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Budget per project</label>
              <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
                {BUDGETS.map((b) => (
                  <option key={b} value={b === 'Select a range' ? '' : b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Where are you in the process? <span style={{ color: 'var(--accent)' }}>*</span></label>
            <select name="stage" required value={form.stage} onChange={handleChange} className={inputClass}>
              {STAGES.map((s) => (
                <option key={s} value={s === 'Where are you in the process?' ? '' : s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Tell me about your company <span style={{ color: 'var(--accent)' }}>*</span></label>
            <textarea name="about" required value={form.about} onChange={handleChange} rows={3} placeholder="What you do, who you serve, links to helpful resources..." className={inputClass + ' resize-none'} />
          </div>

          <div>
            <label className={labelClass}>Anything else</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Anything else you'd like me to know..." className={inputClass + ' resize-none'} />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-500">Something went wrong. Try emailing me at <a href="mailto:akindayopeaceakinwale@gmail.com" className="underline">akindayopeaceakinwale@gmail.com</a></p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 text-xs font-bold uppercase tracking-[0.08em] rounded-md transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}
      </div>
    </div>
  );
}
