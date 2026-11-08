import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import { readPage } from '@/lib/content/pages';
import { ContentPage } from '@/components/ContentPage';
import { ReferralCard } from '@/components/ReferralCard';
import descriptions from '@/lib/content/page-descriptions.json';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: "About Peace Akinwale · B2B SaaS writer & AI workflow builder",
  description: descriptions["About"],
  alternates: { canonical: SITE_URL + "/about" },
}, { key: "about", path: "/about", alt: "About Peace Akinwale · B2B SaaS writer & AI workflow builder" });

export default function Page() {
  const page = readPage('about');
  return (
    <>
      <ContentPage {...page} portrait={true} caseStudy={false}>
        <ReferralCard />
      </ContentPage>
    </>
  );
}
