import { getPosts } from '@/lib/hashnode/client';
import { formatDate, formatReadingTime } from '@/lib/hashnode/utils';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  const { posts } = await getPosts(6);

  return (
    <>
      {/* Hero Section - Split Layout with Photo */}
      <section className="relative overflow-hidden w-full bg-[#1a1f36]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 md:order-1">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-[1.1]" style={{ color: '#ffffff' }}>
                B2B SaaS writer and strategist.
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 max-w-xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                B2B SaaS writer specializing in comparisons, alternative pages, and how-to guides. AI Content Engineer scaling marketing operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/portfolio"
                  className="px-6 sm:px-8 py-3 sm:py-4 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all hover:shadow-lg hover:scale-105 text-center rounded-sm"
                  style={{ backgroundColor: '#e07a5f', color: '#ffffff' }}
                >
                  View Portfolio →
                </Link>
                <Link
                  href="/contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wide hover:bg-white/10 transition-all text-center rounded-sm"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#ffffff' }}
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-64 sm:w-72 md:w-80 lg:w-96">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-accent shadow-2xl">
                  <Image
                    src="/images/peace-akinwale.jpg"
                    alt="Peace Akinwale - B2B SaaS Writer"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-20 bg-accent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Latest Insights
          </h2>
        </div>

        {posts.length > 0 ? (
          <>
            {/* Featured Post (First one, large) */}
            {posts[0] && (
              <Link href={`/${posts[0].slug}`} className="block mb-16 group">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {posts[0].coverImage?.url && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
                      <Image
                        src={posts[0].coverImage.url}
                        alt={posts[0].title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div>
                    {posts[0].tags && posts[0].tags.length > 0 && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4 bg-accent/10 text-accent">
                        {posts[0].tags[0].name}
                      </span>
                    )}
                    <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4 transition-colors group-hover:text-accent text-foreground leading-tight">
                      {posts[0].title}
                    </h3>
                    <p className="text-lg mb-6 line-clamp-3 text-muted-foreground">
                      {posts[0].brief}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <time dateTime={posts[0].publishedAt}>
                        {formatDate(posts[0].publishedAt)}
                      </time>
                      <span>•</span>
                      <span>{formatReadingTime(posts[0].readTimeInMinutes)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid of other posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.slice(1, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  className="group"
                >
                  {post.coverImage?.url && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-4">
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-wide mb-3 bg-accent/10 text-accent">
                      {post.tags[0].name}
                    </span>
                  )}

                  <h3 className="font-serif text-xl font-bold mb-2 transition-colors group-hover:text-accent text-foreground leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-sm mb-3 line-clamp-2 text-muted-foreground">
                    {post.brief}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt, 'MMM dd')}
                    </time>
                    <span>•</span>
                    <span>{formatReadingTime(post.readTimeInMinutes)}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide transition-all hover:shadow-lg hover:scale-105 bg-accent text-white rounded-sm"
              >
                View All Articles
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No articles yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* CTA Section - Navy & Orange */}
      <section className="relative overflow-hidden mt-24 bg-[#1a1f36]">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>
            Need content that drives results?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Let's discuss how strategic content can help your B2B SaaS grow.
            From comparison pages to technical guides, I'll help you convert readers into customers.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 font-sans text-sm font-semibold uppercase tracking-wide transition-all hover:shadow-xl hover:scale-105 rounded-sm"
            style={{ backgroundColor: '#e07a5f', color: '#ffffff' }}
          >
            Start a Project →
          </Link>
        </div>
      </section>
    </>
  );
}
