import { serializeJsonLd, type JsonLd } from '@/lib/seo/jsonld';

// One <script type="application/ld+json"> for a page's structured data. The
// builders in lib/seo/jsonld.ts make the objects; this only prints them safely.
export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
