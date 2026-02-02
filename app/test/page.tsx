import { getPosts, getPublication } from '@/lib/hashnode/client';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';

export default async function TestPage() {
  // Fetch publication info and posts
  const publication = await getPublication();
  const { posts } = await getPosts(10);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Hashnode API Test Page
      </h1>

      {/* Publication Info */}
      {publication && (
        <div style={{ marginBottom: '3rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Publication Info
          </h2>
          <p><strong>Title:</strong> {publication.title}</p>
          <p><strong>Author:</strong> {publication.author.name}</p>
          {publication.author.bio?.text && (
            <p><strong>Bio:</strong> {publication.author.bio.text}</p>
          )}
        </div>
      )}

      {/* Posts List */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Recent Articles ({posts.length} found)
      </h2>

      {posts.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {posts.map((post, index) => (
            <div
              key={post.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {index + 1}. {post.title}
              </h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                {post.brief}
              </p>
              <div style={{ fontSize: '0.875rem', color: '#888' }}>
                <span>Published: {formatDate(post.publishedAt)}</span>
                {' • '}
                <span>{formatReadingTime(post.readTimeInMinutes)}</span>
                {' • '}
                <span>Slug: /{post.slug}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        marginRight: '0.5rem',
                        background: '#e0e0e0',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666' }}>No articles found. Check your API configuration.</p>
      )}

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          ✓ If you see articles above, the Hashnode API integration is working correctly!
        </p>
      </div>
    </div>
  );
}
