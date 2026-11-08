'use client';

import { useRef, useState } from 'react';
import { CALENDLY_URL } from '@/lib/site';
import './referral-card.css';

const introduction = [
  'Peace Akinwale writes B2B SaaS content and builds AI workflows for marketing teams and agencies. He writes BOFU content optimized for AI search and intentionally mentions your product capabilities so human readers and AI tools can tie your brand to the relevant use cases.',
  'He has designed a browser extension to record AI search activity, and can help with automation with AI where your team needs one.',
  'He’s Peace Akinwale on LinkedIn and you can book a call here:',
];

export function ReferralCard() {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const message = useRef<HTMLDivElement>(null);

  async function copyIntroduction() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText([...introduction, CALENDLY_URL].join('\n\n'));
      setStatus('copied');
    } catch {
      // Keep a useful fallback when clipboard access is unavailable or denied.
      if (message.current) {
        const range = document.createRange();
        range.selectNodeContents(message.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus('error');
    }
  }

  return (
    <section className="referral" aria-labelledby="referral-heading">
      <h2 id="referral-heading">Want to recommend me?</h2>
      <p className="referral-help">Here’s an introduction you can send.</p>
      <div className="referral-card">
        <div className="referral-message" ref={message}>
          {introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <p><a href={CALENDLY_URL}>{CALENDLY_URL}</a></p>
        </div>
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
