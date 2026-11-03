import { ogImagePath } from '@/lib/og';
import Link from 'next/link';
import type { Metadata } from 'next';
import { WorkWithMe } from '@/components/WorkWithMe';
import { MANYREQUESTS_ARTICLE_COUNT, MANYREQUESTS_RANKINGS, MANYREQUESTS_SINCE } from '@/lib/portfolio/manyrequests';
import '@/components/case-study/case-study.css';
import './manyrequests.css';

export const metadata: Metadata = {
  title: `ManyRequests case study, ${MANYREQUESTS_ARTICLE_COUNT} B2B SaaS articles`,
  description:
    `How I wrote ${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests and made the product useful inside the piece.`,
  alternates: {
    canonical: 'https://peaceakinwale.com/case-studies/manyrequests',
  },
  openGraph: {
    title: `Case study: ${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests`,
    description:
      `How I wrote ${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests and made the product useful inside the piece.`,
    url: 'https://peaceakinwale.com/case-studies/manyrequests',
    siteName: 'Peace Akinwale',
    type: 'article',
    images: ogImagePath('case-study-manyrequests')
      ? [{ url: ogImagePath('case-study-manyrequests')!, width: 1200, height: 630, alt: `${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests` }]
      : [{ url: 'https://peaceakinwale.com/images/case-studies/manyrequests/manyrequests-homepage.png', width: 1512, height: 793, alt: 'The ManyRequests homepage' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Case study: ${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests`,
    description:
      `How I wrote ${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests and made the product useful inside the piece.`,
    images: [ogImagePath('case-study-manyrequests') ?? 'https://peaceakinwale.com/images/case-studies/manyrequests/manyrequests-homepage.png'],
  },
};

// The chapters, in page order. The cover's "What's in here" list reads them.
const CHAPTERS = [
  { id: 'the-challenge', title: 'A crowded category where the easy version of this work is familiar' },
  { id: 'what-i-did', title: `What I did across all ${MANYREQUESTS_ARTICLE_COUNT} articles` },
  { id: 'the-articles', title: 'The articles that explain the approach' },
  { id: 'the-results', title: 'What the work produced' },
];

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

// The one hand-built case study (the others come from content/informal/*.md
// through app/case-studies/[slug]). It uses the same cover, short version and
// chapters as the template so the site reads as one design. The prose is Peace's.
export default function ManyRequestsCaseStudyPage() {
  return (
    <>
      <header className="cs-cover cs-page">
        <div className="gutter mx-auto max-w-[1180px]">
          <p className="cs-crumbs">
            <Link href="/case-studies">Case studies</Link>
            <span aria-hidden="true"> / </span>
            <span>ManyRequests</span>
          </p>
          <h1>{MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests</h1>
          <p className="cs-point">Articles where the product shows up inside the piece, and what they did in search.</p>
          <dl className="cs-strip">
            <div><dt>Written for</dt><dd>ManyRequests, since {MANYREQUESTS_SINCE}</dd></div>
            <div><dt>Reading time</dt><dd>about 8 min</dd></div>
          </dl>
          <nav className="cs-index-nav" aria-label="In this case study">
            <p>What’s in here</p>
            <ul>
              {CHAPTERS.map((c) => (
                <li key={c.id}><a href={`#${c.id}`}>{c.title}</a></li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="gutter mx-auto max-w-[1180px] cs-page">
        <section className="cs-short" aria-label="In short">
          <p className="cs-short-label">The short version</p>
          <p className="cs-short-text">
            <Ext href="https://www.manyrequests.com/">ManyRequests</Ext> did not need more blog posts that mentioned the product once near the end and called that product-led content. They needed articles that could rank for the right searches and show where the product fit while the reader was still making up their mind.
          </p>
        </section>

        <div className="cs-chapter">
          <div className="prose">
            <p>
              I&rsquo;ve written {MANYREQUESTS_ARTICLE_COUNT} articles for ManyRequests since {MANYREQUESTS_SINCE}. Most of them sit close to the bottom of the funnel. Comparison pages, alternatives pages, workflow guides, and operational topics where agency owners are already trying to decide what tool to use or how to run a cleaner system.
            </p>
            <p>
              The goal was simple. Make the article useful enough to earn trust, then make the product feel like a logical next step inside the article itself.
            </p>
            <figure className="video">
              <iframe
                src="https://www.youtube.com/embed/jYtpAL8aPyE?si=2YFGZwcHvBzKUZ2f"
                title="ManyRequests product demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
              <figcaption>ManyRequests&rsquo; product demo.</figcaption>
            </figure>
          </div>
        </div>

        <section id="the-challenge" className="cs-chapter" aria-labelledby="the-challenge-h">
          <div>
            <h2 id="the-challenge-h">{CHAPTERS[0].title}</h2>
            <div className="prose">
              <p>
                ManyRequests sells client portal and agency management software for creative agencies and productized service businesses. That puts them in a crowded search space. They are competing with generic <Ext href="https://manyrequests.com/blog/client-facing-project-management-tool">project management tools</Ext> and bigger software brands with more authority.
              </p>
              <p>
                The easy version of this work is familiar. Write a listicle for a comparison keyword and mention the product in the conclusion. That kind of article can rank for a while, but it does a weak job of helping the reader understand why this product matters and how it helps.
              </p>
              <p>
                ManyRequests needed something better. The brief was not to publish content for its own sake. It was to write articles where the product could do real work inside the body of the piece.
              </p>
            </div>
          </div>
        </section>

        <section id="what-i-did" className="cs-chapter" aria-labelledby="what-i-did-h">
          <div>
            <h2 id="what-i-did-h">{CHAPTERS[1].title}</h2>
            <div className="prose">
              <h3>I chose topics where I could explain how the product works inside the article</h3>
              <p>
                Before I wrote anything, I asked one question of each topic. Can I show the reader where ManyRequests fits before the article is over?
              </p>
              <p>
                If the answer was yes, the topic scored higher (using the <Ext href="https://blog.timsoulo.com/business-potential-the-most-important-metric-in-content-marketing/">business potential score</Ext>). If the fit was weak, I either changed the angle or treated the piece as broader educational content instead of trying to force the product into it.
              </p>
              <p>
                That is what pushed the work toward topics like these. <Ext href="https://manyrequests.com/blog/workfront-alternatives">Workfront alternatives</Ext>, <Ext href="https://www.manyrequests.com/blog/clickup-alternatives">ClickUp alternatives</Ext>, <Ext href="https://manyrequests.com/blog/client-facing-project-management-tool">client-facing project management tool</Ext>, <Ext href="https://manyrequests.com/blog/retainer-management-software">retainer management software</Ext>, and <Ext href="https://manyrequests.com/blog/design-annotation-software">design annotation tools</Ext>. In those searches, the reader is already comparing tools or trying to solve an operational problem that ManyRequests helps with.
              </p>
              <p>
                That filter also helped on broader topics like <Ext href="https://www.manyrequests.com/blog/agency-retainer-model">agency retainer model</Ext>. It kept me honest. If the product could not help explain the workflow, I had no reason to wedge it into the piece.
              </p>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/case-studies/manyrequests/manyrequests-business-potential-score.png"
                  alt="Business potential score spreadsheet showing topic fit ratings for ManyRequests articles"
                  loading="lazy"
                />
                <figcaption>The business potential score for each topic, in the keyword sheet.</figcaption>
              </figure>

              <h3>I showed the product through workflows and screenshots</h3>
              <p>
                Once a topic passed that first filter, I made the product useful inside the article. Not visible. Useful.
              </p>
              <p>In most articles, that meant the same pattern.</p>
              <ul>
                <li>Explain the workflow, not only the feature</li>
                <li>Show the product where a screenshot helps the reader understand the step</li>
                <li>Use customer examples where proof matters more than marketing copy</li>
              </ul>
              <p>You can see that pattern in the work.</p>

              <div className="mr-callout">
                <Ext href="https://www.manyrequests.com/blog/wrike-vs-clickup">Wrike vs ClickUp</Ext>
                <p>
                  The reader is comparing more than task management tools. Many of them are trying to figure out what works for an agency that has to manage client approvals and billing in one place.
                </p>
                <p>
                  That gave me room to explain why a client portal and white-label delivery matter in the first place. It also let me show where ManyRequests fits better than another internal PM tool.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/case-studies/manyrequests/wrike-vs-clickup-product.png"
                  alt="ManyRequests product shown inside the Wrike vs ClickUp article"
                  loading="lazy"
                />
              </div>

              <div className="mr-callout">
                <Ext href="https://www.manyrequests.com/blog/agency-retainer-model">Agency Retainer Model</Ext>
                <p>
                  The product fit is less obvious at first, which is why I like it as proof. The article is teaching the reader how to structure and run a retainer. That gave me a practical place to show add-on services and intake forms inside ManyRequests. The product was not tacked on. It was part of the operational advice.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/case-studies/manyrequests/agency-retainer-model-product.png"
                  alt="ManyRequests product shown inside the Agency Retainer Model article"
                  loading="lazy"
                />
              </div>

              <div className="mr-callout">
                <Ext href="https://www.manyrequests.com/blog/design-annotation-software">Design Annotation Tools</Ext>
                <p>
                  The fit is direct. The feature is the topic. That article let me explain the markup flow and video feedback with screenshots and concrete use cases instead of generic feature copy.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/case-studies/manyrequests/design-annotation-tools-product.png"
                  alt="ManyRequests product shown inside the Design Annotation Tools article"
                  loading="lazy"
                />
              </div>

              <h3>I wrote each article to answer the next question a buyer would ask</h3>
              <p>Search intent gets someone into the article. It does not finish the job.</p>
              <p>
                A reader searching &ldquo;Workfront alternatives&rdquo; also has other questions. Does the alternative work for agencies? Is there a clean way for clients to submit requests? Can the team manage billing in the same place? Does the whole thing still work once the agency grows?
              </p>
              <p>
                So I wrote the body to answer those follow-up questions inside the piece. That is part of what made the work feel product-led without turning it into a sales page. The product showed up where the reader needed an answer, not where the brand wanted one more mention.
              </p>
            </div>
          </div>
        </section>

        <section id="the-articles" className="cs-chapter" aria-labelledby="the-articles-h">
          <div>
            <h2 id="the-articles-h">{CHAPTERS[2].title}</h2>
            <div className="prose">
              <p>
                <strong>Wrike vs ClickUp.</strong> Shows how I handle hard comparison content. The article meets the search intent. It also reframes the decision around what agencies need, not only what a general PM buyer might want.
              </p>
              <p>
                <strong>Agency Retainer Model.</strong> Shows how I handle broader educational queries. The topic is not an alternatives page. The product has to earn its place through the workflow.
              </p>
              <p>
                <strong>Design Annotation Tools.</strong> Shows the clearest version of the method. The product belongs in the article from the start, and the screenshots make that obvious.
              </p>
            </div>
          </div>
        </section>

        <section id="the-results" className="cs-chapter" aria-labelledby="the-results-h">
          <div>
            <h2 id="the-results-h">{CHAPTERS[3].title}</h2>
            <div className="prose">
              <p>
                This work produced a large body of published content for ManyRequests and helped strengthen the bottom of their funnel around commercial and product-adjacent searches.
              </p>
              <ul>
                <li>{MANYREQUESTS_ARTICLE_COUNT} published articles across comparison and agency operations topics</li>
                <li>22 high-fit topics where the product could be explained and shown in the body</li>
                <li>Strong concentration around high-intent searches where ManyRequests had real product fit</li>
                <li>{MANYREQUESTS_RANKINGS.length} articles on Google&rsquo;s first page on 3 November 2026, shown below</li>
                <li>Ongoing retainer, which tells you as much as any vanity metric</li>
              </ul>
            </div>

            {/* Outside .prose so the template's figure rules and the lightbox leave the photo alone. */}
            <figure className="mr-quote">
                <blockquote>
                  &ldquo;Peace specializes in product-led blog content, and it really shows in his work. He doesn&rsquo;t chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. <strong>His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</strong>&rdquo;
                </blockquote>
                <figcaption>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/clients/regine-garcia.png" alt="Regine Garcia" width={44} height={44} />
                  <span><b>Regine Garcia</b>Operations, Content &amp; Systems at ManyRequests</span>
                </figcaption>
              </figure>

            <div className="mr-ranks" id="rankings">
              <h3>Where they rank on Google, 3 November 2026</h3>
              <p>Each screenshot shows the search and the ManyRequests result in context. Positions count organic results only. Searched with US results and no personalisation. Rankings move, so these are dated, not a promise.</p>
              <ul>
                {MANYREQUESTS_RANKINGS.map((r) => (
                  <li key={r.query}>
                    <figure>
                      <a href={r.shot} target="_blank" rel="noopener">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.shot} alt={`Google results for “${r.query}”, with the ManyRequests article in position ${r.position}`} width={800} height={600} loading="lazy" />
                      </a>
                      <figcaption>
                        <b>#{r.position}</b> for &ldquo;{r.query}&rdquo;. <a href={r.url} target="_blank" rel="noopener">{r.title}</a>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>

            <div className="prose">
              <p>What worked here was more than volume. It was product judgment.</p>
              <p>
                The articles did not treat ManyRequests like a logo to attach at the end of a post. They used the product to help explain the workflow and the decision the reader was already trying to make. That is what made the content more useful and more commercial at the same time.
              </p>
            </div>
          </div>
        </section>

        <WorkWithMe
          heading="Want articles like these for your product?"
          body="If your blog publishes on a schedule but the product never shows up in the work, that’s where I start."
          secondary={{ label: 'See my prices', href: '/services' }}
        />
      </div>
    </>
  );
}
