import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode/client';
import { TitlePage } from '@/components/home/TitlePage';
import { TheQuestion } from '@/components/home/TheQuestion';
import { Redline } from '@/components/home/Redline';
import { TheRecord } from '@/components/home/TheRecord';
import { TheSystems } from '@/components/home/TheSystems';
import { InTheirWords } from '@/components/home/InTheirWords';
import { Colophon } from '@/components/home/Colophon';
import '@/components/home/home.css';

export const metadata: Metadata = {
  title: 'B2B SaaS Content Writer | Peace Akinwale',
  description:
    'B2B SaaS content writer for product-led software companies. I write articles that rank, refresh content with business potential, and help brands show up in AI search.',
  keywords: ['B2B SaaS content writer', 'product-led content writer', 'B2B content writer', 'SaaS content writer'],
  alternates: {
    canonical: 'https://peaceakinwale.com',
  },
};

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://peaceakinwale.com/#home',
  url: 'https://peaceakinwale.com',
  name: 'Peace Akinwale | B2B SaaS Content Writer',
  description:
    'Homepage for Peace Akinwale, a B2B SaaS content writer who specializes in product-led content, content refreshes, and AI-search-friendly articles.',
  about: {
    '@type': 'Person',
    name: 'Peace Akinwale',
    jobTitle: 'B2B SaaS content writer',
  },
  mainEntity: {
    '@type': 'Service',
    name: 'B2B SaaS content writing',
    provider: {
      '@type': 'Person',
      name: 'Peace Akinwale',
    },
    serviceType: 'B2B SaaS content writer',
  },
};

export default async function HomePage() {
  const { posts } = await getPosts(3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }} />
      <TitlePage />
      <TheQuestion />
      <Redline />
      <TheRecord posts={posts} />
      <TheSystems />
      <InTheirWords />
      <Colophon />
    </>
  );
}
