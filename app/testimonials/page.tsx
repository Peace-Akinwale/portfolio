import type { Metadata } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import { Container, PageHeader, Reveal } from '@/components/ui';
import { CtaBlock } from '@/components/CtaBlock';

type TextSegment = { text: string; strong?: boolean };

type LinkedInTestimonial = {
  name: string;
  role: string;
  company: string;
  date: string;
  photo: string;
  paragraphs: TextSegment[][];
};

type ScreenshotTestimonial = {
  name: string;
  role: string;
  company: string;
  note: string;
  image: string;
  alt: string;
};

const LINKEDIN_URL = 'https://www.linkedin.com/in/peaceakinwale/';

const linkedInTestimonials: LinkedInTestimonial[] = [
  {
    name: 'Regine Garcia',
    role: 'Operations, Content, & Systems',
    company: 'ManyRequests',
    date: 'February 9, 2026',
    photo: '/images/clients/regine-garcia.png',
    paragraphs: [
      [{ text: "I've worked with Peace on content for ManyRequests, and he's one of the most thoughtful B2B SaaS content marketers I've collaborated with." }],
      [
        {
          text: "Peace specializes in product-led blog content, and it really shows in his work. He doesn't chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. His pieces are well-researched, structured with intent, and grounded in real use cases, which makes them genuinely useful.",
        },
      ],
      [
        { text: 'What I appreciate most is his level of detail and care. He asks the right questions, challenges assumptions when needed, and consistently delivers content that aligns with the content strategy. For example, ' },
        { text: 'his top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.', strong: true },
      ],
      [{ text: "If you're a software company or agency looking for a writer who understands B2B SaaS, product-led growth, and conversion-focused content, Peace is someone I'd highly recommend working with." }],
    ],
  },
  {
    name: 'Lily Ugbaja',
    role: 'Fractional Content Marketing',
    company: 'Spicy Margarita',
    date: 'October 15, 2025',
    photo: '/images/clients/lily-ugbaja.png',
    paragraphs: [
      [
        { text: 'Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. ' },
        { text: 'He took feedback really fast and always came back stronger,', strong: true },
        { text: ' the kind of person who makes your work easier just by being on the team.' },
      ],
    ],
  },
  {
    name: 'Nathan Vander Heyden',
    role: 'Head of Marketing',
    company: 'Marker.io',
    date: 'September 25, 2025',
    photo: '/images/clients/nathan-vander-heyden.jpg',
    paragraphs: [
      [{ text: 'I had a great experience working with Peace for a content project that spanned half a quarter.' }],
      [
        { text: "I'm particularly impressed by his ability to follow briefs to a T, yet " },
        { text: 'adapt & reorganize information on the fly', strong: true },
        { text: ' based on what he knows about our ICP.' },
      ],
      [{ text: "He also keeps to deadlines, and we never needed more than one round of feedback per article, and none towards the end of our project. I'll work with him again." }],
    ],
  },
  {
    name: 'Crista Siglin',
    role: 'Editor',
    company: 'Pangea.ai',
    date: 'October 14, 2022',
    photo: '/images/clients/crista-siglin.png',
    paragraphs: [
      [
        { text: 'Peace does great work from the beginning of every assignment. He follows guidelines, is available and receptive to feedback, and implements edits swiftly and efficiently. He consistently works in this manner. ' },
        { text: 'Every article of his that I have been assigned to edit has been well-written and well-researched.', strong: true },
      ],
    ],
  },
  {
    name: 'Olumide Akinlaja',
    role: 'Founder & Lead Strategist',
    company: 'Onigege Ara',
    date: 'March 21, 2022',
    photo: '/images/clients/olumide-akinlaja.jpg',
    paragraphs: [
      [{ text: 'Akinwale is an excellent writer with a keen eye for details. He worked with me at Onigege Ara for about 2 years, where he executed many content writing and copywriting projects with great success.' }],
      [{ text: 'He is an expert at article and blog writing, web content writing, product description writing, and creating compelling sales copies.' }],
      [{ text: 'He is loyal, dedicated, and boasts of an impressive work ethic. He is a great addition to any writing team.', strong: true }],
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
    alt: 'Screenshot of Melissa Malec praising the research, structure, and product placements in the article.',
  },
];

export const metadata: Metadata = {
  title: 'Client Testimonials | Peace Akinwale',
  description: 'Read what clients say about working with Peace Akinwale, B2B SaaS content writer for product-led software companies.',
  alternates: {
    canonical: 'https://peaceakinwale.com/testimonials',
  },
};

function Paragraph({ segments }: { segments: TextSegment[] }) {
  return (
    <p>
      {segments.map((s, i) =>
        s.strong ? (
          <strong key={i} className="font-semibold text-foreground">
            {s.text}
          </strong>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </p>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        label="Testimonials"
        title="What my clients say"
        lede="Every word here is from a client I worked with directly: LinkedIn recommendations and feedback from real projects, unedited."
      />

      <Container className="pb-8">
        <ol className="border-b border-border">
          {linkedInTestimonials.map((t) => (
            <Reveal as="li" key={t.name} className="grid gap-x-12 gap-y-6 border-t border-border py-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
              <div className="flex items-start gap-4 lg:flex-col lg:gap-5">
                <Image src={t.photo} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" sizes="56px" />
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                  <p className="tabular mt-2 text-xs text-muted-foreground">
                    <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      LinkedIn, {t.date}
                    </a>
                  </p>
                </div>
              </div>
              <blockquote className="flex max-w-[62ch] flex-col gap-4 text-[17px] leading-[1.75] text-muted-foreground">
                {t.paragraphs.map((p, i) => (
                  <Paragraph key={i} segments={p} />
                ))}
              </blockquote>
            </Reveal>
          ))}
        </ol>

        <section className="mt-20">
          <p className="t-label mb-8 text-muted-foreground">Direct feedback</p>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {screenshotTestimonials.map((t) => (
              <Reveal as="figure" key={t.name}>
                <Image
                  src={t.image}
                  alt={t.alt}
                  width={1400}
                  height={900}
                  className="h-auto w-full rounded-sm border border-border"
                  loading="lazy"
                  sizes="(min-width: 1024px) 46vw, 92vw"
                />
                <figcaption className="mt-4">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.role}, {t.company}. {t.note}.
                  </p>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </section>
      </Container>

      <CtaBlock title="Ready to work together?" lede="Book a free 30-minute call. No commitment, no pressure, just a conversation about your content goals." />
    </>
  );
}
