import { getFaviconUrl } from '@/lib/ogImage';

export type Client = { name: string; domain: string; favicon: string };

export const CLIENTS: Client[] = [
  { name: 'ManyRequests', domain: 'manyrequests.com' },
  { name: 'Jabra', domain: 'jabra.com' },
  { name: 'Marker.io', domain: 'marker.io' },
  { name: 'HigherVisibility', domain: 'highervisibility.com' },
  { name: 'Pangea.ai', domain: 'pangea.ai' },
  { name: 'Spicy Margarita', domain: 'spicymargarita.co' },
].map((c) => ({ ...c, favicon: getFaviconUrl(c.domain, 32) }));

export const CALENDLY_URL = 'https://calendly.com/akindayopeaceakinwale/30min';
export const AVAILABILITY = 'Currently accepting 2 new clients';
export const BOOK_LABEL = 'Book a call';
