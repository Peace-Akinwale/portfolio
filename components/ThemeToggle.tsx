'use client';

import { useTheme } from 'next-themes';

// Light or dark, remembered by next-themes in localStorage. Until someone
// picks, the site starts in light mode. Both icons render and CSS shows
// the right one from [data-theme], so the server markup never guesses.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Switch between light and dark mode"
      title="Light or dark mode"
    >
      <svg className="icon-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
      </svg>
      <svg className="icon-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
