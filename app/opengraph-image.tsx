import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Default link-preview image for every page that doesn't set its own.
// Colours mirror the site palette in app/globals.css; update both together.
export const alt = 'Peace Akinwale, B2B SaaS content writer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COLORS = {
  background: '#0F2334',
  foreground: '#E6EEF4',
  muted: '#A4B9C9',
  accent: '#F2B33A',
};

export default async function Image() {
  const portrait = await readFile(join(process.cwd(), 'public/images/og-portrait.jpg'), 'base64');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: COLORS.background,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 64px',
          }}
        >
          <div style={{ fontSize: 30, color: COLORS.accent, display: 'flex' }}>peaceakinwale.com</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 76, lineHeight: 1.05, color: COLORS.foreground, fontWeight: 700 }}>
              Product-led content for B2B SaaS
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.4, color: COLORS.muted, marginTop: 28 }}>
              Articles where the product shows up because it solves the problem.
            </div>
          </div>
          <div style={{ fontSize: 34, color: COLORS.foreground, display: 'flex' }}>Peace Akinwale</div>
        </div>
        <img
          src={`data:image/jpeg;base64,${portrait}`}
          width={420}
          height={630}
          style={{ objectFit: 'cover' }}
          alt=""
        />
      </div>
    ),
    size,
  );
}
