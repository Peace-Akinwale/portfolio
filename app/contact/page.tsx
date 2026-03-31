import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Peace Akinwale',
  description: 'Get in touch with Peace Akinwale to discuss B2B SaaS content writing projects, content refreshes, or AI-supported editorial systems.',
  alternates: {
    canonical: 'https://peaceakinwale.com/contact',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
