import { describe, expect, it } from 'vitest';
import { sanitizePastedHtml } from './paste-sanitize';

describe('sanitizePastedHtml', () => {
  it('keeps structural tags and strips inline styles', () => {
    const dirty = '<p style="color: red; font-family: Arial">Hello <strong style="font-weight: bold">world</strong></p>';
    expect(sanitizePastedHtml(dirty)).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('unwraps non-allowlisted tags but keeps their text', () => {
    const dirty = '<div><span>Plain <font color="red">text</font></span></div>';
    expect(sanitizePastedHtml(dirty)).toBe('Plain text');
  });

  it('drops script and iframe tags entirely', () => {
    const dirty = '<p>Safe</p><script>alert(1)</script><iframe src="x"></iframe>';
    expect(sanitizePastedHtml(dirty)).toBe('<p>Safe</p>');
  });

  it('removes event handlers on allowed tags', () => {
    const dirty = '<a href="https://example.com" onclick="steal()">link</a>';
    expect(sanitizePastedHtml(dirty)).toBe('<a href="https://example.com">link</a>');
  });

  it('keeps lists and list items', () => {
    const dirty = '<ul><li style="margin: 0">one</li><li>two</li></ul>';
    expect(sanitizePastedHtml(dirty)).toBe('<ul><li>one</li><li>two</li></ul>');
  });

  it('promotes Google Docs internal wrappers to plain paragraphs', () => {
    const dirty = '<b id="docs-internal-guid-123"><p class="x">Hello</p></b>';
    expect(sanitizePastedHtml(dirty)).toBe('<p>Hello</p>');
  });

  it('keeps headings 1 through 6', () => {
    const dirty = '<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6>';
    expect(sanitizePastedHtml(dirty)).toBe('<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6>');
  });

  it('falls back to empty string on empty input', () => {
    expect(sanitizePastedHtml('')).toBe('');
  });

  it('keeps anchor hrefs but drops all other anchor attributes', () => {
    const dirty = '<a href="https://example.com" target="_blank" rel="noopener" data-x="y">link</a>';
    expect(sanitizePastedHtml(dirty)).toBe('<a href="https://example.com">link</a>');
  });
});
