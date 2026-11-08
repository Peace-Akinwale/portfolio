import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SlugPage, { generateMetadata as slugMetadata } from '../../[slug]/page';
import { CLIENT_PAGES } from '@/lib/content/client-pages';

// /writing/<client>: the client writing-sample pages, rendered by the same code
// as the old root addresses (/b2b-content-for-manyrequests and so on), 8 Nov 2026.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CLIENT_PAGES).map((client) => ({ client }));
}

type Props = { params: Promise<{ client: string }> };

async function slugFor(params: Props['params']): Promise<string> {
  const { client } = await params;
  const slug = CLIENT_PAGES[client];
  if (!slug) notFound();
  return slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await slugFor(params);
  return slugMetadata({ params: Promise.resolve({ slug }) });
}

export default async function ClientWritingPage({ params }: Props) {
  const slug = await slugFor(params);
  return SlugPage({ params: Promise.resolve({ slug }) });
}
