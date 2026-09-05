import type { Metadata } from 'next';
import { CtaBlock } from '@/components/CtaBlock';
import { CaseSection, CaseStudyShell } from '@/components/case-studies/CaseStudyShell';
import { CASE_STUDIES } from '@/lib/content/case-studies';

/**
 * DRAFT. Held unpublished (lib/content/case-studies.ts: published: false)
 * until Peace has reviewed it and cleared it with the client. Not linked from
 * the index, the sitemap, or the nav, and marked noindex while unpublished.
 * Source: case-studies/steve-toth/index.md with every commercial term removed.
 * Review copy: docs/case-studies/notebook-agency-draft.md
 */

const study = CASE_STUDIES.find((c) => c.slug === 'notebook-agency')!;

export const metadata: Metadata = {
  title: 'Case Study: Notebook Agency | Peace Akinwale',
  description: study.summary,
  alternates: { canonical: 'https://peaceakinwale.com/case-studies/notebook-agency' },
  robots: study.published ? undefined : { index: false, follow: false },
};

export default function NotebookAgencyCaseStudyPage() {
  return (
    <>
      <CaseStudyShell study={study} date="September 2026" readTime="7 min read">
        <CaseSection label="Overview">
          <p className="text-foreground">
            Notebook Agency is a B2B SaaS SEO agency in Toronto whose founder, Steve Toth, publishes constantly: a LinkedIn
            audience built on years of daily posts, two public notebooks of SEO and AI notes, a coaching practice, and a
            conference. The content was the business. The problem was that all of it ran through one person.
          </p>
          <p>
            I joined in May 2026 as the content operator. The brief was to build the system that lets the founder&rsquo;s voice
            scale without the founder writing every word: a LinkedIn engine grounded in his own notebooks, a blog production
            pipeline for the agency, and the feedback loop that keeps both sounding like him.
          </p>
        </CaseSection>

        <CaseSection label="The challenge" title="A voice that could not be outsourced, and a calendar that could not be missed">
          <p>
            Three years of the founder&rsquo;s LinkedIn posts told a clear story once I analysed the tracker: a small share of
            posts, the ones other people reposted, carried almost all of the engagement. One format, the &ldquo;speaker
            announcement,&rdquo; averaged zero. Ghostwritten generic thought leadership was never going to work here. Every post
            had to come from something he had actually written or said.
          </p>
          <p>
            At the same time, the agency needed a predictable monthly volume of posts and articles, reviewed by a founder with
            very little time, and published on a schedule that did not depend on anyone being awake.
          </p>
        </CaseSection>

        <CaseSection label="What I built" title="An engine that drafts from the notebooks, scores against a rubric, and learns from his edits">
          <h3 className="t-h3 mt-2 text-foreground">Grounding</h3>
          <p>
            Every post starts from a source: an entry in one of the founder&rsquo;s two public notebooks, a call transcript, or an
            industry item he has a position on. Sources live in a Notion database with their own metadata, and the engine reads the
            live page body at draft time. Nothing is invented. A verifier step cuts any claim it cannot trace to a source, and if
            it cuts too much the post is flagged for a human instead of being published thin.
          </p>

          <h3 className="t-h3 mt-6 text-foreground">Scoring</h3>
          <p>
            I turned an analysis of hundreds of his best posts into a 100-point rubric across six dimensions: hook, proof, structure,
            value density, emotional architecture, and close. Eight archetypes (how-to, curated list, myth-buster, origin story,
            and others) give each draft a shape. A draft that fails the rubric twice is still slotted into the calendar, marked for
            review, so the calendar never has an empty day.
          </p>

          <h3 className="t-h3 mt-6 text-foreground">The feedback loop</h3>
          <p>
            When the founder edits a draft in Notion, the engine diffs his revision against the original, classifies the change
            (voice, structure, proof, banned pattern), and stores it. A synthesis job clusters those edits and promotes recurring
            ones into rules the drafting agents read next time. His corrections become the style guide. Over the first month the
            engine also gained a colon rule, a positions library, and a list of banned openers, all from his edits rather than my
            guesses.
          </p>

          <h3 className="t-h3 mt-6 text-foreground">Operations</h3>
          <p>
            The pipeline runs as a scheduled service, not from my laptop: a monthly batch of roughly twenty-two posts generated in
            two waves with two human checkpoints, a real-time Notion webhook so a status change in the database schedules or
            cancels the post in the publishing tool within a minute, an image pipeline, and alerts to Telegram when anything fails.
            The founder&rsquo;s workflow is now: open Notion, read, edit, change a status.
          </p>
        </CaseSection>

        <CaseSection label="Beyond LinkedIn" title="The same system, pointed at the blog and the website">
          <p>
            The blog pipeline reuses the engine&rsquo;s grounding and feedback layers for long-form agency articles. For the website
            rebrand I built a self-contained interactive preview of the new homepage so the founder and the design lead could react
            to a real page rather than a document; that file became the spec for the build. For the LinkedIn visuals, eight
            animated prototypes in a day isolated what &ldquo;more personality&rdquo; actually meant for this audience, and the
            winning direction became the first entry in a template library the engine now picks from per post.
          </p>
        </CaseSection>

        <CaseSection label="What I learned" title="Three lessons worth keeping">
          <p>
            <strong>Audit the pipeline before trusting it.</strong> Three review passes on the first version found nine production
            bugs the happy path never showed: silent fallbacks, a scheduler that could double-publish, tests that had drifted from
            the code. The audits took a day. The alternative was finding out in the founder&rsquo;s feed.
          </p>
          <p>
            <strong>Ask the API what it accepts.</strong> Three wrong guesses at a publishing tool&rsquo;s schema cost three
            deploys. One introspection query fixed it. When an API can describe itself, that is the first move.
          </p>
          <p>
            <strong>&ldquo;I&rsquo;ll know it when I see it&rdquo; is legitimate feedback.</strong> The visual direction took eight
            prototypes, each isolating one variable. That was not waste. It was the only way to find out what the founder was
            pointing at.
          </p>
        </CaseSection>

        <CaseSection label="Results">
          <p>
            The engine is in production and the first monthly batches have shipped. Engagement deltas, newsletter and product
            signups attributed to the content, and conference ticket sales from the campaign are being tracked and will be added
            here once there is enough data to report honestly.
          </p>
        </CaseSection>
      </CaseStudyShell>

      <CtaBlock title="Have a founder whose voice needs to scale?" lede="Content operations, grounded in what your team has actually said. Talk me through where the bottleneck is." />
    </>
  );
}
