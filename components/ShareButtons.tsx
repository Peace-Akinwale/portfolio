'use client';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
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
        Copy Link
      </button>
    </div>
  );
}
