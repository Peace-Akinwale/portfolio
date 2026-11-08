'use client';

import { useEffect } from 'react';

export function ImageLightbox() {
  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.prose img'))
      .filter((image) => !image.closest('a, .client-logo, .reviewer-attribution'));
    const cleanup: (() => void)[] = [];
    let closeActive: (() => void) | undefined;

    function open(index: number, trigger: HTMLImageElement) {
      closeActive?.();
      const dialog = document.createElement('dialog');
      dialog.className = 'image-viewer';
      dialog.setAttribute('aria-label', 'Image viewer');
      const toolbar = document.createElement('div');
      toolbar.className = 'image-viewer-toolbar';
      const fullSize = document.createElement('a');
      fullSize.textContent = 'Open full-size image';
      fullSize.target = '_blank';
      fullSize.rel = 'noopener';
      const close = document.createElement('button');
      close.textContent = 'Close';
      close.type = 'button';
      close.autofocus = true;
      toolbar.append(fullSize, close);
      const image = document.createElement('img');
      const controls = document.createElement('div');
      controls.className = 'image-viewer-controls';
      const count = document.createElement('span');
      count.setAttribute('aria-live', 'polite');
      const previous = document.createElement('button');
      previous.type = 'button';
      previous.textContent = 'Previous';
      const next = document.createElement('button');
      next.type = 'button';
      next.textContent = 'Next';
      controls.append(previous, count, next);
      controls.hidden = images.length < 2;
      dialog.append(toolbar, image, controls);
      const update = () => {
        const source = images[index];
        image.src = source.dataset.originalSrc || source.src;
        image.alt = source.alt;
        fullSize.href = image.src;
        count.textContent = `${index + 1} / ${images.length}`;
      };
      const move = (delta: number) => { index = (index + delta + images.length) % images.length; update(); };
      previous.onclick = () => move(-1);
      next.onclick = () => move(1);
      const oldOverflow = document.body.style.overflow;
      const finish = () => {
        dialog.remove();
        document.body.style.overflow = oldOverflow;
        trigger.focus({ preventScroll: true });
        closeActive = undefined;
      };
      closeActive = finish;
      close.onclick = finish;
      dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(); });
      dialog.addEventListener('click', (event) => { if (event.target === dialog) finish(); });
      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      });
      update();
      document.body.append(dialog);
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    }

    images.forEach((image, index) => {
      const old = { role: image.getAttribute('role'), tabindex: image.getAttribute('tabindex'), label: image.getAttribute('aria-label') };
      image.setAttribute('role', 'button');
      image.setAttribute('tabindex', '0');
      image.setAttribute('aria-label', `Enlarge image: ${image.alt || 'Article image'}`);
      const click = () => open(index, image);
      const key = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); click(); }
      };
      image.addEventListener('click', click);
      image.addEventListener('keydown', key);
      cleanup.push(() => {
        image.removeEventListener('click', click);
        image.removeEventListener('keydown', key);
        for (const [attribute, value] of Object.entries({ role: old.role, tabindex: old.tabindex, 'aria-label': old.label })) {
          if (value === null) image.removeAttribute(attribute); else image.setAttribute(attribute, value);
        }
      });
    });
    return () => { closeActive?.(); cleanup.forEach((dispose) => dispose()); };
  }, []);
  return null;
}
