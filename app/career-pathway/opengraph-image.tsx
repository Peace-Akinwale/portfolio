import { ImageResponse } from 'next/og';
import * as fs from 'fs';
import * as path from 'path';

export const alt = 'Career Assessment Tool — Figure out the career you\'re the best fit for.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const bgPath = path.join(process.cwd(), 'public', 'images', 'career-pathway-og-replicate.png');
const bgBase64 = `data:image/png;base64,${fs.readFileSync(bgPath).toString('base64')}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <img
          src={bgBase64}
          width={1200}
          height={630}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  );
}
