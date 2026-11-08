import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { ReferralCard } from '@/components/ReferralCard';
import { CALENDLY_URL } from '@/lib/site';

let root: ReturnType<typeof createRoot> | undefined;
const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  document.body.innerHTML = '';
  window.getSelection()?.removeAllRanges();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

async function renderCard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  const container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root!.render(<ReferralCard />));
  return container.querySelector('button')!;
}

it('copies the complete referral with its usable booking URL, without the surrounding instructions', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const button = await renderCard(writeText);
  await act(async () => button.click());
  const copied = writeText.mock.calls[0][0];
  expect(copied).toMatch(/^Peace Akinwale writes B2B SaaS content/);
  expect(copied).toContain('He has designed a browser extension to record AI search activity');
  expect(copied).toContain('He’s Peace Akinwale on LinkedIn');
  expect(copied.endsWith(CALENDLY_URL)).toBe(true);
  expect(copied).not.toContain('Want to recommend me?');
  expect(copied).not.toContain('Copy introduction');
  expect(document.querySelector('[role="status"]')?.textContent).toBe('Ready to paste into a message.');
  expect(button.textContent).toBe('Copied');
});

it('never claims success when copying is blocked and selects the full introduction for manual copying', async () => {
  const button = await renderCard(vi.fn().mockRejectedValue(new Error('Clipboard denied')));
  await act(async () => button.click());
  expect(button.textContent).toBe('Copy introduction');
  expect(button.disabled).toBe(false);
  expect(document.querySelector('[role="status"]')?.textContent).toContain('Couldn’t copy automatically');
  expect(window.getSelection()?.toString()).toContain(CALENDLY_URL);
  expect(window.getSelection()?.toString()).toMatch(/^Peace Akinwale/);
});
