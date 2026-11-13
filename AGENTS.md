# Agent notes

The CMS is WordPress.com. Public reads go through `lib/wordpress/` and the `WORDPRESS_SITE` environment variable. Hosting is Railway, not Vercel. Hashnode is not used.

`lib/wordpress/client.ts` loads posts and pages for the site. `lib/wordpress/management.ts` is the authenticated publishing client, used only by the old migration script.

`vercel.json` is leftover from Vercel. Railway does not read it. The weekly MyLinks maintenance job is a Railway cron service, not the `crons` entry in that file.

Do not describe the stack as Hashnode or Vercel, and do not add `HASHNODE_*` environment variables.
