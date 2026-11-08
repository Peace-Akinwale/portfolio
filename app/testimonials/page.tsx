import descriptions from '@/lib/content/page-descriptions.json';
import { WorkWithMe } from '@/components/WorkWithMe';
import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import fs from 'node:fs';
import path from 'node:path';

type TextSegment = {
  text: string;
  strong?: boolean;
};

type LinkedInTestimonial = {
  name: string;
  role: string;
  company: string;
  date: string;
  photo: string;
  initials: string;
  paragraphs: TextSegment[][];
};

type ScreenshotTestimonial = {
  name: string;
  photo?: string;
  role: string;
  company: string;
  note: string;
  image: string;
  alt: string;
};

// The recommendations section of the profile, not the profile itself.
const RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/peaceakinwale/details/recommendations/';

const linkedInTestimonials: LinkedInTestimonial[] = [
  {
    name: 'Regine Garcia',
    role: 'Operations, Content, & Systems',
    company: 'ManyRequests',
    date: 'February 9, 2026',
    photo: '/images/clients/regine-garcia.png',
    initials: 'RG',
    paragraphs: [
      [
        {
          text: "I've worked with Peace on content for ManyRequests, and he's one of the most thoughtful B2B SaaS content marketers I've collaborated with.",
        },
      ],
      [
        {
          text: "Peace specializes in product-led blog content, and it really shows in his work. He doesn't chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. His pieces are well-researched, structured with intent, and grounded in real use cases, which makes them genuinely useful.",
        },
      ],
      [
        {
          text: 'What I appreciate most is his level of detail and care. He asks the right questions, challenges assumptions when needed, and consistently delivers content that aligns with the content strategy. For example, ',
        },
        {
          text: 'his top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.',
          strong: true,
        },
      ],
      [
        {
          text: "If you're a software company or agency looking for a writer who understands B2B SaaS, product-led growth, and conversion-focused content, Peace is someone I'd highly recommend working with. 🔥",
        },
      ],
    ],
  },
  {
    name: 'Lily Ugbaja',
    role: 'Fractional Content Marketing',
    company: 'Spicy Margarita',
    date: 'October 15, 2025',
    photo: '/images/clients/lily-ugbaja.png',
    initials: 'LU',
    paragraphs: [
      [
        {
          text: 'Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. ',
        },
        {
          text: 'He took feedback really fast and always came back stronger,',
          strong: true,
        },
        {
          text: ' the kind of person who makes your work easier just by being on the team.',
        },
      ],
    ],
  },
  {
    name: 'Nathan Vander Heyden',
    role: 'Head of Marketing',
    company: 'Marker.io',
    date: 'September 25, 2025',
    photo: '/images/clients/nathan-vander-heyden.jpg',
    initials: 'NV',
    paragraphs: [
      [
        {
          text: 'I had a great experience working with Peace for a content project that spanned half a quarter.',
        },
      ],
      [
        {
          text: "I'm particularly impressed by his ability to follow briefs to a T, yet ",
        },
        {
          text: 'adapt & reorganize information on the fly',
          strong: true,
        },
        {
          text: ' based on what he knows about our ICP.',
        },
      ],
      [
        {
          text: "He also keeps to deadlines, and we never needed more than one round of feedback per article - and none towards the end of our project! I'll work with him again.",
        },
      ],
    ],
  },
  {
    name: 'Crista Siglin',
    role: 'Editor',
    company: 'Pangea.ai',
    date: 'October 14, 2022',
    photo: '/images/clients/crista-siglin.png',
    initials: 'CS',
    paragraphs: [
      [
        {
          text: 'Peace does great work from the beginning of every assignment. He follows guidelines, is available and receptive to feedback, and implements edits swiftly and efficiently. He consistently works in this manner. ',
        },
        {
          text: 'Every article of his that I have been assigned to edit has been well-written and well-researched.',
          strong: true,
        },
      ],
    ],
  },
  {
    name: 'Olumide Akinlaja',
    role: 'Founder & Lead Strategist',
    company: 'Onigege Ara',
    date: 'March 21, 2022',
    photo: '/images/clients/olumide-akinlaja.jpg',
    initials: 'OA',
    paragraphs: [
      [
        {
          text: 'Akinwale is an excellent writer with a keen eye for details. He worked with me at Onigege Ara for about 2 years, where he executed many content writing and copywriting projects with great success.',
        },
      ],
      [
        {
          text: 'He is an expert at article and blog writing, web content writing, product description writing, and creating compelling sales copies.',
        },
      ],
      [
        {
          text: 'He is loyal, dedicated, and boasts of an impressive work ethic. He is a great addition to any writing team.',
          strong: true,
        },
      ],
    ],
  },
];

const screenshotTestimonials: ScreenshotTestimonial[] = [
  {
    name: 'Adam Heitzman',
    role: 'Managing Partner',
    company: 'HigherVisibility',
    note: 'Client feedback after first delivery',
    image: '/images/testimonials/adam-heitzman-highervisibility.png',
    alt: 'Screenshot of Adam Heitzman praising the work and asking to set up a monthly writing cadence.',
  },
  {
    name: 'Melissa Malec',
    role: 'Content Lead',
    company: 'Jabra (via Spicy Margarita)',
    note: 'Full feedback on the hybrid work schedule piece',
    image: '/images/testimonials/melissa-malec-jabra.png',
    alt: 'Screenshot of Melissa Malec praising the research and the product placements in the article.',
  },
  {
    name: 'Lateef Maleek',
    photo: '/images/clients/lateef-maleek.png',
    role: 'Agency owner',
    company: 'Exceed SEO',
    note: 'A message from 21 September 2026 about the depth and specificity of the research, with my reply',
    image: '/case-studies/exceed-seo/lateef-research-feedback.png',
    alt: 'Screenshot of Lateef Maleek praising the depth and specificity of Peace’s product research.',
  },
].filter((t) => fs.existsSync(path.join(process.cwd(), 'public', t.image)));

export const metadata: Metadata = withOg({
  title: 'What clients say',
  description: descriptions.Testimonials,
  alternates: {
    canonical: 'https://peaceakinwale.com/testimonials',
  },
}, { key: 'testimonials', path: '/testimonials', alt: 'What clients say about Peace Akinwale' });

/** The person's own words for the lead line: the bold passage they marked out, or the first sentence. Never a paraphrase. */
function excerptOf(paragraphs: TextSegment[][]): string {
  const strong = paragraphs.flat().find((segment) => segment.strong);
  if (strong) return strong.text.trim().replace(/[,;]$/, '');
  const first = (paragraphs[0] ?? []).map((segment) => segment.text).join('');
  const sentence = first.match(/^[^.!?]*[.!?]/);
  return (sentence ? sentence[0] : first).trim();
}

function renderParagraph(paragraph: TextSegment[], paragraphIndex: number) {
  return (
    <p key={paragraphIndex} className="text-[15px] leading-[1.75] text-muted-foreground">
      {paragraph.map((segment, segmentIndex) => (
        segment.strong ? (
          <strong key={segmentIndex} className="font-semibold text-foreground">
            {segment.text}
          </strong>
        ) : (
          <Fragment key={segmentIndex}>{segment.text}</Fragment>
        )
      ))}
    </p>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5ZM.5 8h4V23h-4V8Zm7 0h3.83v2.05h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.88c0-1.88-.03-4.29-2.61-4.29-2.62 0-3.02 2.04-3.02 4.15V23h-4V8Z" />
    </svg>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 sm:pb-12 sm:pt-16">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-foreground">What clients say</h1>
            <p>Clients and editors describe the product research, deadlines and revisions involved in working with me, so you can see what to expect when you send a brief.</p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--muted)' }}>
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex flex-col gap-6">
              {linkedInTestimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-[1.5rem] border border-border bg-background px-6 py-6 shadow-[0_12px_30px_rgba(21,24,58,0.05)] sm:px-8 sm:py-8"
                >
                  <p
                    className="text-[1.35rem] leading-[1.35] text-foreground"
                    style={{ fontFamily: 'var(--font-serif)', fontOpticalSizing: 'auto', textWrap: 'pretty' }}
                  >
                    &ldquo;{excerptOf(testimonial.paragraphs)}&rdquo;
                  </p>

                  <div className="mt-5 flex items-center gap-4">
                    {testimonial.photo ? (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                        loading="lazy"
                        sizes="48px"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                        {testimonial.initials}
                      </span>
                    )}
                    <div>
                      <p className="text-base font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} · {testimonial.company}</p>
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>

                  <blockquote className="mt-6 max-w-[68ch] space-y-4 border-t border-border pt-5">
                    {testimonial.paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
                  </blockquote>

                  <a
                    href={RECOMMENDATIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-foreground transition-opacity hover:opacity-90"
                    style={{ background: 'var(--accent)' }}
                  >
                    <LinkedInIcon />
                    See it on LinkedIn
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-8 text-[1.5rem] text-foreground">Feedback on individual articles</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {screenshotTestimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-[1.5rem] border border-border bg-background p-5 shadow-[0_12px_30px_rgba(21,24,58,0.05)] sm:p-6"
                >
                  <div className="rounded-[1rem] border border-border bg-muted/70 p-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.alt}
                      width={1400}
                      height={900}
                      className="h-auto w-full rounded-[0.75rem]"
                      loading="lazy"
                      sizes="(min-width: 1024px) 46vw, 92vw"
                    />
                  </div>
                  <div className="mt-5 reviewer-attribution">
                    {testimonial.photo && <Image src={testimonial.photo} alt={testimonial.name} width={56} height={56} sizes="56px" />}
                    <div><p className="text-base font-bold text-foreground">{testimonial.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <WorkWithMe
            heading="Have something in mind?"
            body="Tell me about your product, an article you need, or an idea you’d like to develop for your team."
            secondary={{ label: 'Send a message', href: '/contact' }}
          />
        </div>
      </section>
    </>
  );
}
