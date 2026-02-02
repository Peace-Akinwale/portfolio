# Peace Akinwale Portfolio

A beautiful, editorial-style portfolio website built with Next.js and powered by Hashnode as a headless CMS.

## Features

- ✅ Editorial/Magazine design with monochrome color scheme
- ✅ Dark mode support (auto-detects system preference + manual toggle)
- ✅ Blog with search functionality
- ✅ Individual article pages with beautiful typography
- ✅ Custom pages (About, Portfolio, Contact)
- ✅ Google Form and Calendly integrations
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Fully responsive
- ✅ Fast and performant

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **CMS:** Hashnode (Headless)
- **Deployment:** Vercel (recommended)
- **Language:** TypeScript

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Hashnode publication host and API token

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Visit `http://localhost:3000`

## Deployment to Vercel

### Step 1: Push to GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git add .
   git commit -m "Initial commit: Portfolio website"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it (e.g., "portfolio")
   - Don't initialize with README

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel:** https://vercel.com

2. **Import your GitHub repository:**
   - Click "Add New Project"
   - Import your portfolio repository
   - Vercel will auto-detect it's a Next.js project

3. **Add environment variables:**
   - In project settings, add:
     - `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` = `peaceakinwale.hashnode.dev`
     - `HASHNODE_API_TOKEN` = `your-api-token`

4. **Deploy:**
   - Click "Deploy"
   - Wait ~2 minutes for the build to complete

### Step 3: Connect Your Domain

1. **In Vercel project settings:**
   - Go to "Domains"
   - Add `peaceakinwale.com`

2. **Update DNS settings (at your domain registrar):**
   - Add A record: `76.76.21.21`
   - Add CNAME record: `www` → `cname.vercel-dns.com`

3. **Wait for DNS propagation:**
   - Usually takes 5-30 minutes
   - Vercel will auto-issue SSL certificate

## Content Management

### Publishing Blog Articles

1. Go to your Hashnode dashboard
2. Write your article
3. Click "Publish"
4. Article automatically appears on your site within seconds

### Updating Static Pages

Create static pages in Hashnode with these slugs:
- `about` - For the About page
- `portfolio` - For the Portfolio page
- `services` - For the Services page (optional)

### Updating Contact Page Embeds

Edit `app/contact/page.tsx`:
- Google Form embed URL (line 33)
- Calendly embed URL (line 53)

## Project Structure

```
portfolio/
├── app/
│   ├── [slug]/          # Dynamic article pages
│   ├── about/           # About page
│   ├── api/             # API routes
│   ├── blog/            # Blog listing page
│   ├── contact/         # Contact page
│   ├── portfolio/       # Portfolio page
│   ├── test/            # Test page (remove in production)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   ├── robots.ts        # SEO robots config
│   └── sitemap.ts       # Dynamic sitemap
├── components/          # Reusable components
├── lib/
│   └── hashnode/        # Hashnode API integration
├── .env.local           # Environment variables (not in git)
└── .env.example         # Example env file
```

## Customization

### Colors

Edit `app/globals.css` to customize colors:
- Light mode: `:root` section
- Dark mode: `[data-theme="dark"]` section

### Typography

Fonts are defined in `app/globals.css`:
- Serif: Georgia (for headings and article content)
- Sans-serif: System fonts (for UI elements)

### Navigation

Edit `components/Header.tsx` to add/remove navigation links.

## Support

For issues or questions:
1. Check the Hashnode API is working: Visit `/test`
2. Check environment variables are set correctly
3. Check the browser console for errors

## License

© 2026 Peace Akinwale. All rights reserved.
