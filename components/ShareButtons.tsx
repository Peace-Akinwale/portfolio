'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

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
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
      >
        Share on X
      </Button>
      <Button variant="outline" size="sm" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>
        Share on LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        {copied ? 'Copied' : 'Copy link'}
      </Button>
    </div>
  );
}
