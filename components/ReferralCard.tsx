'use client';

import { useEffect, useRef, useState } from 'react';
import { CALENDLY_URL, LINKEDIN_URL } from '@/lib/site';
import './referral-card.css';

const introduction = [
  'Peace Akinwale writes B2B SaaS content and builds AI workflows for marketing teams and agencies. He writes BOFU content optimized for AI search and intentionally mentions your product capabilities so human readers and AI tools can tie your brand to the relevant use cases.',
  'He has designed a browser extension to record AI search activity, and can help with automation with AI where your team needs one.',
];
const introductionText = [
  ...introduction,
  `He’s Peace Akinwale on LinkedIn (${LINKEDIN_URL}) and you can book a call here:`,
  CALENDLY_URL,
].join('\n\n');

export function ReferralCard() {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const manualCopy = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status === 'error') {
      manualCopy.current?.focus();
      manualCopy.current?.select();
    }
  }, [status]);

  async function copyIntroduction() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(introductionText);
      setStatus('copied');
    } catch {
      // The manual-copy version also includes full URLs behind the short labels.
      setStatus('error');
    }
  }

  return (
    <section className="referral" aria-labelledby="referral-heading">
      <h2 id="referral-heading">Want to recommend me?</h2>
      <p className="referral-help">Here’s an introduction you can send.</p>
      <div className="referral-card">
        <div className="referral-message">
          {introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <p>He’s <a href={LINKEDIN_URL}>Peace Akinwale on LinkedIn</a> and you can book a call here:</p>
          <p><a href={CALENDLY_URL}>Book a call</a></p>
        </div>
        {status === 'error' && <textarea ref={manualCopy} className="referral-manual-copy" aria-label="Introduction with full links for manual copying" readOnly value={introductionText} />}
        <div className="referral-actions">
          <button className="button button-ink" type="button" onClick={copyIntroduction} disabled={status === 'copying'}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {status === 'copied' ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>}
            </svg>
            {status === 'copied' ? 'Copied' : status === 'copying' ? 'Copying…' : 'Copy introduction'}
          </button>
          <p role="status" aria-live="polite">
            {status === 'copied' ? 'Ready to paste into a message.' : status === 'error' ? 'Couldn’t copy automatically. Copy the selected text above.' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}
