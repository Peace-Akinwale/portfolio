import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = withOg({
  title: 'Contact',
  description: 'Tell me about an article you need or work your team repeats every week. Book a call or send a message. I reply within one business day.',
  alternates: {
    canonical: 'https://peaceakinwale.com/contact',
  },
}, { key: 'contact', path: '/contact', alt: 'Contact Peace Akinwale' });

export default function ContactPage() {
  return <ContactForm />;
}
