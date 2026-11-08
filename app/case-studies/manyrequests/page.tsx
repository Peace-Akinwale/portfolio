import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import { readPage } from '@/lib/content/pages';
import { ContentPage } from '@/components/ContentPage';
import descriptions from '@/lib/content/page-descriptions.json';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: "How I wrote 51 product-led articles for ManyRequests and made the product useful inside the piece",
  description: descriptions["ManyRequests"],
  alternates: { canonical: SITE_URL + "/case-studies/manyrequests" },
}, { key: "case-study-manyrequests", path: "/case-studies/manyrequests", alt: "How I wrote 51 product-led articles for ManyRequests and made the product useful inside the piece" });

export default function Page() {
  const page = readPage('manyrequests');
  return (
    <>
      <ContentPage {...page} portrait={false} caseStudy={true} />
    </>
  );
}
