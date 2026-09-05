import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@/components/ui/Button';
import { IndexList, IndexRow } from '@/components/ui/IndexRow';
import { Quote } from '@/components/ui/Quote';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { cx } from '@/lib/cx';

describe('cx', () => {
  it('joins truthy class names', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });
});

describe('Button', () => {
  it('renders an internal link with the solid variant by default', () => {
    const html = renderToStaticMarkup(<Button href="/contact">Book a call</Button>);
    expect(html).toContain('<a');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('bg-accent');
    expect(html).toContain('rounded-full');
    expect(html).not.toContain('target=');
  });

  it('opens external links in a new tab with rel noopener', () => {
    const html = renderToStaticMarkup(<Button href="https://calendly.com/x">Book</Button>);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('renders a native button when no href is given', () => {
    const html = renderToStaticMarkup(<Button variant="outline">Send</Button>);
    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('border-border');
  });

  it('text variant has no padding box', () => {
    const html = renderToStaticMarkup(
      <Button variant="text" href="/work">
        See the work
      </Button>,
    );
    expect(html).toContain('underline');
    expect(html).toContain('px-0');
  });
});

describe('IndexRow', () => {
  it('renders number, title, meta and aside as one list item', () => {
    const html = renderToStaticMarkup(
      <IndexList>
        <IndexRow number="01" title="Wrike vs ClickUp" href="https://example.com/a" meta="ManyRequests, comparison" aside="2025" />
      </IndexList>,
    );
    expect(html).toContain('<ol');
    expect(html).toContain('<li');
    expect(html).toContain('01');
    expect(html).toContain('Wrike vs ClickUp');
    expect(html).toContain('ManyRequests, comparison');
    expect(html).toContain('2025');
    expect(html).toContain('target="_blank"');
  });

  it('uses an internal link for site paths', () => {
    const html = renderToStaticMarkup(
      <IndexList>
        <IndexRow title="ManyRequests" href="/case-studies/manyrequests" />
      </IndexList>,
    );
    expect(html).toContain('href="/case-studies/manyrequests"');
    expect(html).not.toContain('target="_blank"');
  });
});

describe('Quote', () => {
  it('sets attribution after the quote and shows no card', () => {
    const html = renderToStaticMarkup(
      <Quote name="Regine Garcia" role="Head of Content" company="ManyRequests">
        His top-performing posts are product-led ones.
      </Quote>,
    );
    expect(html).toContain('<figure');
    expect(html).toContain('<blockquote');
    expect(html).toContain('Regine Garcia');
    expect(html).toContain('Head of Content');
    expect(html).not.toContain('border');
  });
});

describe('Pill', () => {
  it('renders a live dot by default', () => {
    const html = renderToStaticMarkup(<Pill>Currently accepting 2 new clients</Pill>);
    expect(html).toContain('bg-ok');
  });
});

describe('Section', () => {
  it('applies the ground and the hairline rule', () => {
    const html = renderToStaticMarkup(<Section ground="muted" rule />);
    expect(html).toContain('bg-muted');
    expect(html).toContain('border-t');
    expect(html).toContain('section-y');
  });
});
