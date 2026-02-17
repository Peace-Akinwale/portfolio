'use client';

import { useEffect } from 'react';

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

export function CodeBlockEnhancer() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.prose pre');

    codeBlocks.forEach((pre) => {
      // Skip if already enhanced
      if (pre.querySelector('.copy-btn')) return;

      // Wrap pre in a relative container
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Create copy button with icon
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = COPY_ICON;
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code?.textContent || pre.textContent || '';

        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = CHECK_ICON;
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          btn.innerHTML = CHECK_ICON;
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove('copied');
          }, 2000);
        }
      });

      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
