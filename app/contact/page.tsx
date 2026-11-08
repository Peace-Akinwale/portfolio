import descriptions from '@/lib/content/page-descriptions.json';
import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = withOg({
  title: 'Contact',
  description: descriptions.Contact,
  alternates: {
    canonical: 'https://peaceakinwale.com/contact',
  },
}, { key: 'contact', path: '/contact', alt: 'Contact Peace Akinwale' });

export default function ContactPage() {
  return <ContactForm />;
}
