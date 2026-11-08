import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import { readPage } from '@/lib/content/pages';
import { ContentPage } from '@/components/ContentPage';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: "Find internal links while you work on a draft",
  description: "Find relevant pages on a client\u2019s site, review internal link suggestions for a draft, and export or apply the approved links.",
  alternates: { canonical: SITE_URL + "/projects/mylinks" },
}, { key: "mylinks", path: "/projects/mylinks", alt: "Find internal links while you work on a draft" });

export default function Page() {
  const page = readPage('mylinks');
  return (
    <>
      <ContentPage {...page} portrait={false} caseStudy={false} />
    </>
  );
}
