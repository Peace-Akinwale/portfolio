export const SITE_URL = 'https://peaceakinwale.com';
export const EMAIL = 'akindayopeaceakinwale@gmail.com';
export const CALENDLY_URL = 'https://calendly.com/akindayopeaceakinwale/30min';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/peaceakinwale/';
export const X_URL = 'https://x.com/PeaceAkinwaleA';

// The site's one navigation, read by the header, the footer and the tests.
// Services first (the page a buyer wants), then the two kinds of proof, each
// with one name: Case studies are the tools, Writing is the articles by client.
// Peace keeps "About me" and "Say hi" (29 Oct 2026: clear names over cute ones).
export const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/portfolio', label: 'Writing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About me' },
  { href: '/contact', label: 'Say hi' },
];
