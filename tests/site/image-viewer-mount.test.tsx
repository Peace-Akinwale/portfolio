import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { AppChrome } from '@/components/AppChrome';

vi.mock('next/navigation', () => ({ usePathname: () => '/case-studies/mystyleguide' }));
vi.mock('@/components/Header', () => ({ Header: () => null }));
vi.mock('@/components/Footer', () => ({ Footer: () => null }));
let root: ReturnType<typeof createRoot> | undefined;
afterEach(async () => { await act(async () => root?.unmount()); document.body.innerHTML = ''; });

it('provides the viewer to a page that does not mount its own lightbox', async () => {
  document.body.innerHTML = '<div id="mount"></div>';
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  root = createRoot(document.getElementById('mount')!);
  await act(async () => root!.render(<AppChrome><article><img src="/cover.png" alt="Cover" /></article></AppChrome>));
  document.querySelector<HTMLImageElement>('article img')!.click();
  expect(document.querySelectorAll('dialog[open]')).toHaveLength(1);
  expect(document.querySelector('dialog img')?.getAttribute('alt')).toBe('Cover');
});
