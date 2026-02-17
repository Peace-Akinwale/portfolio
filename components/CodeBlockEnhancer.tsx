'use client';

import { useEffect } from 'react';

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

      // Create copy button
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code?.textContent || pre.textContent || '';

        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
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
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }
      });

      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
