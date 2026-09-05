import { Chapter } from './Chapter';

const ARTICLE_URL = 'https://www.manyrequests.com/blog/agency-retainer-model';

/**
 * Chapter 2, the peak. A paragraph from a published ManyRequests article with
 * the editing pass replayed on scroll: the filler line is struck, the product
 * sentence arrives where the reader needs it, and the margin explains why.
 * Marks are driven by CSS scroll-driven animations (see home.css).
 */
export function Redline() {
  return (
    <Chapter number="02" title="The redline" id="the-redline" ground="surface" silence className="redline">
      <header className="max-w-[62ch]">
        <h2 className="t-h1 text-foreground">Watch the product find its place.</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          From{' '}
          <a href={ARTICLE_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
            Agency Retainer Model: How to Price, Package, and Scale
          </a>
          , written for ManyRequests. An educational topic, not an alternatives page. Scroll, and the edit happens in
          front of you.
        </p>
      </header>

      <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-x-12 xl:mt-24">
        <div className="manuscript text-foreground">
          <p className="t-label mb-8 text-muted-foreground">Lastly, use add-ons where it fits</p>
          <p>
            While every retainer model has its defined scope, there are times when a client needs more work than their
            retainer covers.
          </p>
          <p>
            For example, as a content agency, your client may want to write a case study or an industry research report.
            If you offer similar services, you can structure it as an add-on rather than part of their retainer.{' '}
            <span className="redline-strike">There are plenty of tools out there that can help you manage this.</span>
          </p>
          <p>
            <span className="redline-insert">
              With ManyRequests, you can create as many add-ons as you need, each with their pricing (hourly or per
              project), and service intake forms.
            </span>
          </p>
        </div>

        <aside className="mt-10 flex flex-col gap-8 text-[15px] leading-relaxed lg:mt-0 lg:pt-16" aria-label="Editor's notes">
          <p className="redline-note">
            <span className="t-label block text-accent-2/80">Struck</span>
            The line a brief-following draft writes here. It says nothing the reader did not already know.
          </p>
          <p className="redline-note">
            <span className="t-label block text-accent-2/80">Inserted</span>
            Business potential: 3. The product is the answer to the step the reader is on, so it goes in the how-to, not
            the outro.
          </p>
          <p className="text-muted-foreground">
            <span className="t-label block">Published</span>
            As written.{' '}
            <a href={ARTICLE_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
              Read it on manyrequests.com
            </a>
          </p>
        </aside>
      </div>
    </Chapter>
  );
}
