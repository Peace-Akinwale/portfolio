import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'radial-gradient(circle at 20% 20%, rgba(49,46,129,0.12), transparent 36%), radial-gradient(circle at 85% 18%, rgba(13,148,136,0.14), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: '#312e81',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 18px 40px rgba(49,46,129,0.24)',
              flexShrink: 0,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="58" height="58">
              <path d="M20.5 10.6 A7 7 0 1 0 20.5 21.4" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="13.5" x2="19.5" y2="13.5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
              <line x1="11" y1="16" x2="19.5" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
              <line x1="12" y1="18.5" x2="19.5" y2="18.5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '72px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.05em' }}>contentDB</div>
            <div style={{ fontSize: '26px', lineHeight: 1.3, color: '#475569' }}>
              Content intelligence for SaaS teams and agencies
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-end' }}>
          <div style={{ width: '760px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '32px', lineHeight: 1.35, fontWeight: 600, color: '#0f172a' }}>
              Stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the contentDB web chat while you research, write, or update an article.
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['MCP-connected research', 'Source-grounded answers', 'Private beta'].map((pill) => (
                <div
                  key={pill}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '999px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '20px',
                    fontWeight: 600,
                    boxShadow: '0 1px 0 rgba(15,23,42,0.04)',
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginLeft: 'auto',
              fontSize: '18px',
              color: '#64748b',
              alignSelf: 'flex-end',
            }}
          >
            contentDB live preview
          </div>
        </div>
      </div>
    ),
    size,
  );
}
