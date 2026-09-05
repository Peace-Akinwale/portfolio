import type { ReactNode } from 'react';

export type Testimonial = {
  id: string;
  quote: ReactNode;
  /** The one sentence to pull when space is short. */
  pull: ReactNode;
  name: string;
  role: string;
  company: string;
  photo: string;
};

const em = (text: string) => <strong className="font-semibold text-foreground">{text}</strong>;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'regine',
    quote: (
      <>
        Peace specializes in product-led blog content, and it really shows in his work. He doesn&rsquo;t chase keywords. He
        takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and
        conversions.{' '}
        {em('His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.')}
      </>
    ),
    pull: <>His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</>,
    name: 'Regine Garcia',
    role: 'Head of Content',
    company: 'ManyRequests',
    photo: '/images/clients/regine-garcia.png',
  },
  {
    id: 'nathan',
    quote: (
      <>
        I&rsquo;m particularly impressed by his ability to follow briefs to a T, yet{' '}
        {em('adapt and reorganize information on the fly')} based on what he knows about our ICP. He keeps to deadlines,
        and we never needed more than one round of feedback per article, and none towards the end of our project.
      </>
    ),
    pull: <>We never needed more than one round of feedback per article, and none towards the end of our project.</>,
    name: 'Nathan Vander Heyden',
    role: 'Head of Marketing',
    company: 'Marker.io',
    photo: '/images/clients/nathan-vander-heyden.jpg',
  },
  {
    id: 'lily',
    quote: (
      <>
        Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and
        beyond on every task. {em('He took feedback really fast and always came back stronger')}, the kind of person who
        makes your work easier just by being on the team.
      </>
    ),
    pull: <>He took feedback really fast and always came back stronger.</>,
    name: 'Lily Ugbaja',
    role: 'Head of Content',
    company: 'Spicy Margarita',
    photo: '/images/clients/lily-ugbaja.png',
  },
  {
    id: 'crista',
    quote: (
      <>
        Peace does great work from the beginning of every assignment. He follows guidelines, is available and receptive
        to feedback, and implements edits swiftly and efficiently.{' '}
        {em('Every article of his that I have been assigned to edit has been well-written and well-researched.')}
      </>
    ),
    pull: <>Every article of his that I have been assigned to edit has been well-written and well-researched.</>,
    name: 'Crista Siglin',
    role: 'Editor',
    company: 'Pangea.ai',
    photo: '/images/clients/crista-siglin.png',
  },
];

export function testimonial(id: string): Testimonial {
  const t = TESTIMONIALS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown testimonial: ${id}`);
  return t;
}
