import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell me about an article you need or a task your team keeps doing by hand. Book a call or send a message; I reply within one business day.',
  alternates: {
    canonical: 'https://peaceakinwale.com/contact',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
