import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import { readPage } from '@/lib/content/pages';
import { ContentPage } from '@/components/ContentPage';
import descriptions from '@/lib/content/page-descriptions.json';
import { SITE_URL } from '@/lib/site';
import { JsonLdScript } from '@/components/JsonLdScript';
import { serviceJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = withOg({
  title: "B2B SaaS content writing & AI workflow automation",
  description: descriptions["Services"],
  alternates: { canonical: SITE_URL + "/services" },
}, { key: "services", path: "/services", alt: "B2B SaaS content writing & AI workflow automation" });

export default function Page() {
  const page = readPage('services');
  return (
    <>
      <JsonLdScript data={serviceJsonLd({ name: 'B2B SaaS content writing', description: descriptions.Services, url: '/services', offers: [
        { name: 'Article refresh', price: 400, currency: 'USD' },
        { name: 'New article', price: 600, currency: 'USD' },
      ] })} />
      <ContentPage {...page} portrait={false} caseStudy={false} />
    </>
  );
}
