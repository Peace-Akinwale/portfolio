import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Peace Akinwale, B2B SaaS content writer. Product-led content for B2B SaaS.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default social card for every route without its own. Paper ground,
 * off-black type, one olive rule. Fonts fall back to system sans in the
 * edge runtime; the composition holds without Syne.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#f5f4ef',
          color: '#171614',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5d5b54' }}>
          <span>Peace Akinwale</span>
          <span>B2B SaaS content writer</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 96, height: 4, background: '#64734f', marginBottom: 36 }} />
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', maxWidth: 900 }}>
            Product-led content for B2B SaaS.
          </div>
          <div style={{ marginTop: 32, fontSize: 30, lineHeight: 1.4, color: '#5d5b54', maxWidth: 860 }}>
            Your product shows up in the article because it solves the problem, not because a brief said &ldquo;mention it somewhere.&rdquo;
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, color: '#5d5b54' }}>peaceakinwale.com</div>
      </div>
    ),
    { ...size },
  );
}
