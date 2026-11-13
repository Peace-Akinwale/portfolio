# Peace Akinwale Portfolio

Next.js site for [peaceakinwale.com](https://peaceakinwale.com).

**CMS is WordPress.com** (`WORDPRESS_SITE`, public REST API, `lib/wordpress/`). **Hosting is Railway**, not Vercel. **Hashnode is not used.** The old `lib/hashnode` names were leftovers and have been removed.

## Tech stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- WordPress.com for blog posts and some pages
- Case studies, the homepage, and several other pages live in this repo (`content/`)
- Railway runs `npm run build` and `npm start`. `vercel.json` is leftover from the previous host. Railway does not read it.

## Local development

```bash
npm install
npm run dev
```

Set `WORDPRESS_SITE` (the WordPress.com site, for example `peaceakinwale.wordpress.com`) in `.env.local`. Do not add Hashnode keys. The blog still renders local articles if WordPress cannot be reached.

## Content

Editing a blog post or a WordPress page happens in WordPress, not in this repo. Case studies and other files under `content/` are edited here. See `content/README.md`.
