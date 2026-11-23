// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../../proxy';
import { isMylinksWorkspacePath } from '@/lib/mylinks/routing';

const request = (path: string, host = 'mylinks.peaceakinwale.com') =>
  new NextRequest(`https://${host}${path}`, { headers: { host } });

describe('MyLinks subdomain routing', () => {
  it('leaves the portfolio and legacy app URLs untouched', () => {
    for (const path of ['/', '/projects/mylinks', '/projects/mylinks/auth/callback?code=example']) {
      expect(proxy(request(path, 'peaceakinwale.com')).headers.get('x-middleware-next')).toBe('1');
    }
  });
  it('opens the workspace and canonicalizes legacy links on the new host', () => {
    expect(proxy(request('/')).headers.get('location')).toBe('https://mylinks.peaceakinwale.com/dashboard');
    expect(proxy(request('/projects/mylinks/settings?google_connected=1')).headers.get('location'))
      .toBe('https://mylinks.peaceakinwale.com/settings?google_connected=1');
  });
  it('rewrites workspace pages and email callbacks without losing query parameters', () => {
    for (const path of ['/login', '/dashboard', '/auth/callback?code=example', '/projects/c1e24c19-4f41-42c9-a861-7d4f7e517369']) {
      const response = proxy(request(path));
      expect(response.headers.get('x-middleware-rewrite')).toBe(`https://mylinks.peaceakinwale.com/projects/mylinks${path}`);
      expect(response.headers.get('x-robots-tag')).toBe('noindex');
    }
  });
  it('keeps APIs on the same origin and sends the product overview to the portfolio', () => {
    expect(proxy(request('/api/mylinks/auth/google/callback?code=example')).headers.get('x-middleware-next')).toBe('1');
    expect(proxy(request('/projects/mylinks')).headers.get('location')).toBe('https://peaceakinwale.com/projects/mylinks');
  });
  it('uses the workspace layout for both URL forms, not for portfolio project pages', () => {
    expect(isMylinksWorkspacePath('/dashboard')).toBe(true);
    expect(isMylinksWorkspacePath('/projects/mylinks/dashboard')).toBe(true);
    expect(isMylinksWorkspacePath('/projects/mylinks')).toBe(false);
    expect(isMylinksWorkspacePath('/projects/linkedin-router')).toBe(false);
  });
  it('blocks indexing of the app subdomain', async () => {
    expect(await proxy(request('/robots.txt')).text()).toBe('User-agent: *\nDisallow: /\n');
  });
  it('redirects unused wildcard hosts to the canonical portfolio', () => {
    expect(proxy(request('/about?ref=example', 'unused.peaceakinwale.com')).headers.get('location'))
      .toBe('https://peaceakinwale.com/about?ref=example');
  });
});
