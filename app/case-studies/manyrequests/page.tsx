import type { Metadata } from 'next';
import { Container, Quote } from '@/components/ui';
import { CtaBlock } from '@/components/CtaBlock';
import { CaseSection, CaseStudyShell, Figure, linkClass } from '@/components/case-studies/CaseStudyShell';
import { CASE_STUDIES } from '@/lib/content/case-studies';
import { testimonial } from '@/lib/content/testimonials';

const OG_IMAGE = 'https://peaceakinwale.com/images/case-studies/manyrequests/manyrequests-homepage.png';

export const metadata: Metadata = {
  title: 'Case Study: ManyRequests | Peace Akinwale',
  description: 'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece.',
  alternates: { canonical: 'https://peaceakinwale.com/case-studies/manyrequests' },
  openGraph: {
    title: 'Case Study: ManyRequests. 44 product-led articles, page-one rankings',
    description: 'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece.',
    url: 'https://peaceakinwale.com/case-studies/manyrequests',
    siteName: 'Peace Akinwale',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1512, height: 793, alt: 'ManyRequests, the client portal built for agencies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Study: ManyRequests. 44 product-led articles, page-one rankings',
    description: 'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece.',
    images: [OG_IMAGE],
  },
};

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    {children}
  </a>
);

const IMG = '/images/case-studies/manyrequests';

export default function ManyRequestsCaseStudyPage() {
  const study = CASE_STUDIES.find((c) => c.slug === 'manyrequests')!;
  const regine = testimonial('regine');

  return (
    <>
      <CaseStudyShell study={study} date="April 25, 2026" readTime="8 min read">
        <Container width="narrow" className="py-10">
          <Figure src={`${IMG}/manyrequests-homepage.png`} alt="ManyRequests homepage: the client portal built for agencies" />
        </Container>

        <CaseSection label="Overview">
          <p className="text-foreground">
            <A href="https://www.manyrequests.com/">ManyRequests</A> did not need more blog posts that mentioned the product once
            near the end and called that product-led content. They needed articles that could rank for the right searches, answer
            the reader properly, and show where the product fit while the reader was still making up their mind.
          </p>
          <p>
            I have written 44 articles for ManyRequests over roughly 20 months. Most of them sit close to the bottom of the
            funnel: comparison pages, alternatives pages, workflow guides, and operational topics where agency owners are already
            trying to decide what tool to use or how to run a cleaner system.
          </p>
          <p>
            The goal was simple. Make the article useful enough to earn trust, then make the product feel like a logical next
            step inside the article itself. According to Regine Garcia, Head of Content at ManyRequests, the product-led posts led
            to more traffic and demo requests.
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-accent">
            <li>44 published articles across BOFU and product-adjacent agency operations topics</li>
            <li>22 high-fit topics where the product could be explained and shown directly in the body</li>
            <li>
              Page one for searches like &ldquo;Workfront alternatives,&rdquo; &ldquo;ClickUp vs Notion,&rdquo; and &ldquo;design
              annotation tools&rdquo; at the time of review
            </li>
            <li>Retainer still active</li>
          </ul>
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-sm border border-border">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/jYtpAL8aPyE?si=2YFGZwcHvBzKUZ2f"
              title="ManyRequests product demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </CaseSection>

        <CaseSection label="The challenge" title="A crowded category where the easy version of this work is familiar">
          <p>
            ManyRequests sells client portal and agency management software for creative agencies and productized service
            businesses. That puts them in a crowded search space, competing with generic{' '}
            <A href="https://manyrequests.com/blog/client-facing-project-management-tool">project management tools</A>, alternatives
            sites, affiliate roundups, and bigger software brands with more authority.
          </p>
          <p>
            The easy version of this work is familiar. Pick a comparison keyword, write a listicle, add the client&rsquo;s logo at
            the top, mention the product in the conclusion, and move on. That kind of article can rank for a while, but it does a
            weak job of helping the reader understand why this product matters and how it helps.
          </p>
          <p>
            The brief was not just to publish content. It was to write articles where the product could do real work inside the
            body of the piece.
          </p>
        </CaseSection>

        <CaseSection label="How I approached the work" title="Three things I did consistently across 44 articles">
          <h3 className="t-h3 mt-4 text-foreground">1. I chose topics where I could explain how the product works inside the article</h3>
          <p>
            Before I wrote anything, I looked at each topic through one question: can I show the reader where ManyRequests fits
            before the article is over?
          </p>
          <p>
            If the answer was yes, the topic scored higher on the{' '}
            <A href="https://blog.timsoulo.com/business-potential-the-most-important-metric-in-content-marketing/">business potential score</A>.
            If the fit was weak, I changed the angle or treated the piece as broader educational content instead of forcing the
            product into it.
          </p>
          <p>
            That pushed the work toward <A href="https://manyrequests.com/blog/workfront-alternatives">Workfront alternatives</A>,{' '}
            <A href="https://www.manyrequests.com/blog/clickup-alternatives">ClickUp alternatives</A>,{' '}
            <A href="https://manyrequests.com/blog/client-facing-project-management-tool">client-facing project management tool</A>,{' '}
            <A href="https://manyrequests.com/blog/retainer-management-software">retainer management software</A>, and{' '}
            <A href="https://manyrequests.com/blog/design-annotation-software">design annotation tools</A>. In those searches the
            reader is already comparing tools or trying to solve an operational problem that ManyRequests actually helps with.
          </p>
          <p>
            The filter also kept me honest on broader topics like{' '}
            <A href="https://www.manyrequests.com/blog/agency-retainer-model">agency retainer model</A>. If the product could not
            help explain the workflow, I had no reason to wedge it into the piece.
          </p>
          <Figure
            src={`${IMG}/manyrequests-business-potential-score.png`}
            alt="Business potential score spreadsheet showing topic fit ratings for ManyRequests articles"
            caption="The scoring sheet. Threes and twos got written; ones got a new angle or a pass."
          />

          <h3 className="t-h3 mt-8 text-foreground">2. I showed the product through workflows, screenshots, and customer proof</h3>
          <p>Once a topic passed that filter, I tried to make the product useful inside the article. Not visible. Useful. Three habits:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-accent">
            <li>Explain the workflow, not just the feature</li>
            <li>Show the product where a screenshot helps the reader understand the step</li>
            <li>Use customer examples where proof matters more than marketing copy</li>
          </ul>

          <p className="mt-4">
            <strong>
              <A href="https://www.manyrequests.com/blog/wrike-vs-clickup">Wrike vs ClickUp</A>
            </strong>
            . The reader is not just comparing task management tools. They are trying to work out what works for an agency that
            manages clients, approvals, billing, and delivery in one place. That gave me room to explain why a client portal,
            proofing, and white-label delivery matter, and where ManyRequests fits better than another internal PM tool.
          </p>
          <Figure src={`${IMG}/wrike-vs-clickup-product.png`} alt="ManyRequests product shown inside the Wrike vs ClickUp article" />

          <p className="mt-4">
            <strong>
              <A href="https://www.manyrequests.com/blog/agency-retainer-model">Agency Retainer Model</A>
            </strong>
            . The product fit is less obvious, which is why I like it as proof. The article teaches the reader how to structure and
            run a retainer, and that gave me a practical place to show add-on services, intake forms, and cleaner request handling.
            The product was not tacked on. It was part of the operational advice.
          </p>
          <Figure src={`${IMG}/agency-retainer-model-product.png`} alt="ManyRequests product shown inside the Agency Retainer Model article" />

          <p className="mt-4">
            <strong>
              <A href="https://www.manyrequests.com/blog/design-annotation-software">Design Annotation Tools</A>
            </strong>
            . The fit is direct. The feature is the topic. That article let me explain the dashboard, markup flow, and video
            feedback with screenshots and concrete use cases instead of generic feature copy.
          </p>
          <Figure src={`${IMG}/design-annotation-tools-product.png`} alt="ManyRequests product shown inside the Design Annotation Tools article" />

          <h3 className="t-h3 mt-8 text-foreground">3. I wrote each article to answer the next question a buyer would ask</h3>
          <p>Search intent gets someone into the article. It does not finish the job.</p>
          <p>
            A reader searching &ldquo;Workfront alternatives&rdquo; is also wondering whether the alternative works for agencies,
            whether clients can submit requests cleanly, whether the team can manage billing, whether feedback stays organized,
            and whether the whole thing still works once the agency grows.
          </p>
          <p>
            So I wrote the body to answer those follow-up questions inside the piece. That is part of what made the work feel
            product-led without turning it into a sales page. The product showed up where the reader naturally needed an answer,
            not where the brand wanted one more mention.
          </p>
        </CaseSection>

        <CaseSection label="The results" title="What the work produced">
          <p>
            A large body of published content for ManyRequests, concentrated around commercial and product-adjacent searches where
            the product had real fit.
          </p>
          <ul className="list-disc space-y-2 pl-5 marker:text-accent">
            <li>44 published articles across comparisons, alternatives, workflow guides, and agency operations topics</li>
            <li>Page one visibility for &ldquo;Workfront alternatives&rdquo; and &ldquo;design annotation tools&rdquo; during review</li>
            <li>An ongoing retainer, which usually says as much as any vanity metric</li>
          </ul>
          <div className="mt-6 border-t border-border pt-8">
            <Quote name={regine.name} role={regine.role} company={regine.company} photo={regine.photo}>
              {regine.quote}
            </Quote>
          </div>
        </CaseSection>

        <CaseSection>
          <p className="text-foreground">What worked here was not volume. It was product judgment.</p>
          <p>
            The articles did not treat ManyRequests like a logo to attach at the end of a post. They used the product to help
            explain the problem, the workflow, and the decision the reader was already trying to make. That is what made the
            content more useful, and more commercial, at the same time.
          </p>
        </CaseSection>
      </CaseStudyShell>

      <CtaBlock title="Want articles like these for your product?" lede="If your blog publishes regularly but the product never really shows up in the work, that is usually where I start." />
    </>
  );
}
