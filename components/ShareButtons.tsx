'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex gap-3">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 border border-border text-sm hover:bg-muted transition-colors"
      >
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 border border-border text-sm hover:bg-muted transition-colors"
      >
        LinkedIn
      </a>
      <button
        onClick={handleCopyLink}
        className="px-4 py-2 border border-border text-sm hover:bg-muted transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
