'use client';

import { useState } from 'react';
import { Button, Pill } from '@/components/ui';
import { AVAILABILITY, CALENDLY_URL } from '@/lib/content/clients';

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

const inputClass = 'w-full rounded-sm border border-border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none';
const labelClass = 't-label mb-2 block text-muted-foreground';

export default function ContactForm() {
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
    <div className="mx-auto max-w-6xl gutter pb-24 pt-10 sm:pt-16">
      <div className="mx-auto max-w-3xl">
      <div className="reveal-group mb-10 max-w-[62ch]">
        <p className="t-label mb-6 text-accent" style={{ ['--i' as string]: 0 }}>Contact</p>
        <h1 className="t-h1 text-foreground" style={{ ['--i' as string]: 1 }}>Let&rsquo;s work together.</h1>
        <p className="t-lede mt-6 text-muted-foreground" style={{ ['--i' as string]: 2 }}>
          Book a free 30-minute discovery call below. No commitment, no pressure. Or scroll down and send a message instead.
        </p>
        <div className="mt-6" style={{ ['--i' as string]: 3 }}>
          <Pill>{AVAILABILITY}</Pill>
        </div>
      </div>

      <div className="mb-16 overflow-hidden rounded-md border border-border bg-surface">
        <iframe
          src={`${CALENDLY_URL}?embed_domain=peaceakinwale.com&embed_type=Inline`}
          width="100%"
          height="680"
          title="Book a 30-minute call"
          className="w-full"
        />
      </div>

      <p className="t-label mb-8 border-t border-border pt-8 text-muted-foreground">Prefer to write first?</p>

      {/* ── Form ───────────────────────────────────── */}
      {status === 'sent' ? (
        <div className="flex flex-col gap-4 py-10">
          <p className="t-h2 text-foreground">Message sent.</p>
          <p className="text-muted-foreground">Thanks for reaching out. I will get back to you within one business day.</p>
          <div>
            <Button
              variant="text"
              onClick={() => { setStatus('idle'); setForm({ name: '', email: '', company: '', projectType: '', stage: '', about: '', message: '', budget: '' }); }}
            >
              Send another message
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name <span className="text-accent">*</span></label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Work Email <span className="text-accent">*</span></label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Company</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="Your company name" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Type of project <span className="text-accent">*</span></label>
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
            <label className={labelClass}>Where are you in the process? <span className="text-accent">*</span></label>
            <select name="stage" required value={form.stage} onChange={handleChange} className={inputClass}>
              {STAGES.map((s) => (
                <option key={s} value={s === 'Where are you in the process?' ? '' : s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Tell me about your company <span className="text-accent">*</span></label>
            <textarea name="about" required value={form.about} onChange={handleChange} rows={3} placeholder="What you do, who you serve, links to helpful resources..." className={inputClass + ' resize-none'} />
          </div>

          <div>
            <label className={labelClass}>Anything else</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Anything else you'd like me to know..." className={inputClass + ' resize-none'} />
          </div>

          {status === 'error' && (
            <p className="text-sm text-accent-2" role="alert">
              Something went wrong. Try emailing me at{' '}
              <a href="mailto:akindayopeaceakinwale@gmail.com" className="underline underline-offset-4">
                akindayopeaceakinwale@gmail.com
              </a>
            </p>
          )}

          <div>
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending' : 'Send message'}
            </Button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}
