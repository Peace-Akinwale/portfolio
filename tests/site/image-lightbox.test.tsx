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

it('opens full-size image links without taking over navigation cards or logos', async () => {
  document.body.innerHTML = '<main><a id="photo" href="/full.png"><img src="/thumb.png" alt="Chart"></a><a href="/case-studies/mylinks"><img src="/card.png" alt="Case study"></a><img class="approved-title-icon" src="/brand/logo.svg" alt="Logo"></main><div id="mount"></div>';
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  root = createRoot(document.getElementById('mount')!);
  await act(async () => root!.render(<ImageLightbox />));
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  document.querySelector('#photo img')!.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(document.querySelector('dialog img')?.getAttribute('src')).toContain('/full.png');
  expect(document.querySelector('img[alt="Case study"]')?.getAttribute('role')).toBeNull();
  expect(document.querySelector('img[alt="Logo"]')?.getAttribute('role')).toBeNull();
});

it('handles content inserted after hydration and releases it on a route change', async () => {
  document.body.innerHTML = '<main></main><div id="mount"></div>';
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  root = createRoot(document.getElementById('mount')!);
  await act(async () => root!.render(<ImageLightbox routeKey="/first" />));
  document.querySelector('main')!.innerHTML = '<img src="/late.png" alt="Late screenshot">';
  await new Promise<void>(resolve => queueMicrotask(resolve));
  const late = document.querySelector<HTMLImageElement>('main img')!;
  expect(late.getAttribute('role')).toBe('button');
  late.click();
  expect(document.querySelector('dialog')?.open).toBe(true);
  document.querySelector('main')!.innerHTML = '<img src="/next.png" alt="Next page">';
  await act(async () => root!.render(<ImageLightbox routeKey="/second" />));
  expect(document.querySelector('dialog')).toBeNull();
  expect(document.body.style.overflow).toBe('');
  document.querySelector<HTMLImageElement>('main img')!.click();
  expect(document.querySelectorAll('dialog')).toHaveLength(1);
  expect(document.querySelector('dialog img')?.getAttribute('alt')).toBe('Next page');
});

it('uses the original image behind Next image resizing and supports horizontal swipes', async () => {
  document.body.innerHTML = '<main><img src="/_next/image?url=%2Foriginal.png&amp;w=640&amp;q=75" alt="First"><img src="/two.png" alt="Second"></main><div id="mount"></div>';
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  root = createRoot(document.getElementById('mount')!);
  await act(async () => root!.render(<ImageLightbox />));
  document.querySelector<HTMLImageElement>('main img')!.click();
  const dialog = document.querySelector('dialog');
  expect(dialog?.open).toBe(true);
  expect(dialog?.querySelector('img')?.getAttribute('src')).toContain('/original.png');
  const swipe = (start: number, end: number) => {
    const down = new Event('touchstart');
    Object.defineProperty(down, 'touches', { value: [{ clientX: start, clientY: 100 }] });
    dialog!.dispatchEvent(down);
    const up = new Event('touchend');
    Object.defineProperty(up, 'changedTouches', { value: [{ clientX: end, clientY: 105 }] });
    dialog!.dispatchEvent(up);
  };
  swipe(200, 80);
  expect(dialog?.querySelector('img')?.alt).toBe('Second');
  swipe(80, 200);
  expect(dialog?.querySelector('img')?.alt).toBe('First');
});
