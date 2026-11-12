import type { PortfolioProject } from '@/lib/wordpress/parsePortfolio';

// Articles Peace ghostwrote for Exceed SEO's clients LineUpr and InviteDesk,
// May to October 2026 (Peace, 3 Nov 2026: use them as ghostwritten samples for
// the Exceed SEO work). Each live page was matched to her draft in Drive by its
// title or opening paragraph, and every URL returned 200 on 3 Nov 2026. Left out:
// Cvent vs InviteDesk (rewritten after hand-in, the live opening is not hers) and
// the GDPR piece (no draft text found). The pages carry the client's bylines.

type Section = { heading: string; clientName: string; introHtml?: string; projects: PortfolioProject[] };

export const LINEUPR_SECTION: Section = {
  heading: 'Ghostwritten for LineUpr, through Exceed SEO',
  clientName: 'LineUpr',
  introHtml: '<p>Comparisons and buying guides for an event app.</p>',
  projects: [
    { title: 'Sched pricing 2026: Plans, extra costs and user reviews', link: 'https://lineupr.com/en/blog/sched-pricing' },
    { title: '8 Best Event Survey Apps for Higher Response Rates', link: 'https://lineupr.com/en/blog/best-event-survey-apps' },
    { title: '8 Best Enterprise Event App Software Platforms in 2026', link: 'https://lineupr.com/en/blog/enterprise-event-app-software' },
    { title: '8 Ways Event Apps Improve Attendee Experience', link: 'https://lineupr.com/en/blog/event-app-experience' },
    { title: 'Event App Pricing: What It Costs and How to Budget for Your Event', link: 'https://lineupr.com/en/blog/event-app-pricing' },
    { title: 'Event App Adoption: Why Attendees Don’t Use Your App and What to Do', link: 'https://lineupr.com/en/blog/event-app-adoption' },
    { title: 'Branded Event App: The 9-Point Checklist for Higher Adoption', link: 'https://lineupr.com/en/blog/branded-event-app' },
    { title: 'Attendify Alternatives: 7 Options for Small Teams', link: 'https://lineupr.com/en/blog/attendify-alternatives-for-small-teams' },
    { title: '6 Best Hybrid Event Apps for Internal Events, by Use Case', link: 'https://lineupr.com/en/blog/best-hybrid-event-apps-for-internal-events' },
    { title: 'Sched Alternatives: What Corporate & Non-academic Event Teams Need & 7 Competitors Compared', link: 'https://lineupr.com/en/blog/sched-alternatives' },
    { title: 'Custom Corporate Event App: How to Choose & 7 Options Compared', link: 'https://lineupr.com/en/blog/custom-corporate-event-app' },
    { title: 'The 7 Best Event Apps for Attendee Networking, by Event Size', link: 'https://lineupr.com/en/blog/best-event-apps-for-attendee-networking' },
    { title: 'Whova vs Yapp: Which Event App is Best for You?', link: 'https://lineupr.com/en/blog/whova-vs-yapp' },
    { title: '5 Top-rated Yapp Alternatives in 2026 (Including One That Needs No Download)', link: 'https://lineupr.com/en/blog/best-yapp-alternatives' },
    { title: '6 Guidebook Alternatives for B2B Events (+ No-Download Options)', link: 'https://lineupr.com/en/blog/guidebook-event-app-alternatives' },
  ],
};

export const INVITEDESK_SECTION: Section = {
  heading: 'Ghostwritten for InviteDesk, through Exceed SEO',
  clientName: 'InviteDesk',
  introHtml: '<p>Guides and comparisons for B2B event software.</p>',
  projects: [
    { title: '8 Best Event Check-In Apps for B2B Corporate Events (rewrite)', link: 'https://invitedesk.com/en-gb/blog/event-check-in-apps/' },
    { title: '8 Best CRMs for Event Management in 2026, Compared by Use Case', link: 'https://invitedesk.com/en-gb/blog/crm-for-event-management/' },
    { title: '8 Best Event Lead Capture Software Options for Sales Teams (rewrite)', link: 'https://invitedesk.com/en-gb/blog/best-event-lead-capture-systems/' },
    { title: 'Event Personalisation: How to Create Relevant Guest Journeys Before, During and After Your Event', link: 'https://invitedesk.com/en-gb/blog/event-personalisation/' },
    { title: 'Event Lead Generation: How to Turn the Right Guests Into Pipeline', link: 'https://invitedesk.com/en-gb/blog/event-lead-generation/' },
    { title: 'Guest Management for Corporate Hospitality Events', link: 'https://invitedesk.com/en-gb/blog/guest-management-for-corporate-hospitality-events/' },
    { title: 'Post-Event Follow-Up: The B2B Checklist to Turn Attendees Into Pipeline', link: 'https://invitedesk.com/en-gb/blog/post-event-follow-up/' },
    { title: 'Best Event Attendee Management Software: 6 Tools Sorted by Event Type', link: 'https://invitedesk.com/en-gb/blog/best-event-attendee-management-software/' },
    { title: 'Event Management Software for Microsoft Dynamics 365 (landing page)', link: 'https://invitedesk.com/en-gb/event-management-software-microsoft-dynamics/' },
    { title: 'Best Event Registration Software for B2B Corporate Events: 8 Tools Compared', link: 'https://invitedesk.com/en-gb/blog/best-event-registration-software-for-b2b-corporate-events/' },
    { title: 'Best Event Management Software for B2B Corporate Events (2026)', link: 'https://invitedesk.com/en-gb/blog/best-event-management-software-for-b2b-corporate-events/' },
  ],
};
