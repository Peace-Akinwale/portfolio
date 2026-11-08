import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { ImageLightbox } from '@/components/ImageLightbox';

let root: ReturnType<typeof createRoot> | undefined;
afterEach(async () => { await act(async () => root?.unmount()); document.body.innerHTML = ''; vi.restoreAllMocks(); });

it('opens by keyboard, navigates, restores focus and cleans up after unmount', async () => {
  document.body.innerHTML = '<div class="prose"><img src="/one.jpg" alt="First"><img src="/two.jpg" alt="Second"><a href="/original"><img src="/linked.jpg" alt="Linked"></a></div><div id="mount"></div>';
  HTMLDialogElement.prototype.showModal = function () { this.open = true; this.querySelector('button')?.focus(); };
  const images = document.querySelectorAll('img');
  root = createRoot(document.getElementById('mount')!);
  await act(async () => root!.render(<ImageLightbox />));
  images[0].focus();
  images[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  expect(document.querySelector('dialog')?.open).toBe(true);
  expect(document.querySelector('dialog img')?.getAttribute('alt')).toBe('First');
  expect(images[2].getAttribute('role')).toBeNull();
  document.querySelector('dialog')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  expect(document.querySelector('dialog img')?.getAttribute('alt')).toBe('Second');
  document.querySelector('dialog')!.dispatchEvent(new Event('cancel', { cancelable: true }));
  expect(document.querySelector('dialog')).toBeNull();
  expect(document.activeElement).toBe(images[0]);
  expect(document.body.style.overflow).toBe('');
  images[0].click();
  await act(async () => root!.unmount()); root = undefined;
  expect(document.querySelector('dialog')).toBeNull();
  images[0].click();
  expect(document.querySelector('dialog')).toBeNull();
});
