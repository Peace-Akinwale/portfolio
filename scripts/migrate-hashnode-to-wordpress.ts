import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  createWordPressPost,
  getAllWordPressPosts,
  getWordPressAccessToken,
  getWordPressSiteInfo,
} from '../lib/wordpress/client';

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function getFlagValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function summarize(text: string, limit: number = 140): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit - 1)}…`;
}

interface HashnodeMigrationPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  content: {
    html: string;
    markdown: string;
  };
  coverImage?: {
    url: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTimeInMinutes: number;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  author: {
    name: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  url: string;
}

async function fetchAllHashnodePosts() {
  const host = requireEnv('NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST');
  const apiToken = process.env.HASHNODE_API_TOKEN;
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiToken) {
    headers = {
      ...headers,
      Authorization: apiToken,
    };
  }

  const query = `
    query GetPostsForMigration($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        title
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              title
              brief
              slug
              content {
                html
                markdown
              }
              coverImage {
                url
              }
              publishedAt
              updatedAt
              readTimeInMinutes
              tags {
                id
                name
                slug
              }
              author {
                name
              }
              seo {
                title
                description
              }
              url
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  const allPosts: HashnodeMigrationPost[] = [];

  let publicationTitle: string | null = null;
  let after: string | undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: {
          host,
          first: 20,
          after,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Hashnode request failed (${response.status}): ${body.slice(0, 500)}`);
    }

    const data = (await response.json()) as {
      data?: {
        publication?: {
          title?: string;
          posts: {
            edges: Array<{
              node: HashnodeMigrationPost;
            }>;
            pageInfo: {
              hasNextPage: boolean;
              endCursor?: string;
            };
          };
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (data.errors?.length) {
      throw new Error(data.errors.map((error) => error.message).join('; '));
    }

    const publication = data.data?.publication;
    if (!publication) {
      throw new Error(`No Hashnode publication found for host "${host}"`);
    }

    publicationTitle = publication.title ?? publicationTitle;
    allPosts.push(...publication.posts.edges.map((edge) => edge.node));
    hasNextPage = publication.posts.pageInfo.hasNextPage;
    after = publication.posts.pageInfo.endCursor;
  }

  return {
    publication: publicationTitle ? { title: publicationTitle } : null,
    posts: allPosts.sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    ),
  };
}

async function main() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  loadEnvFile(envPath);

  const wpSite = requireEnv('WORDPRESS_SITE');
  const wpUsername = requireEnv('WORDPRESS_USERNAME');
  const wpClientId = requireEnv('WORDPRESS_CLIENT_ID');
  const wpClientSecret = requireEnv('WORDPRESS_CLIENT_SECRET');
  const wpAppPassword = requireEnv('WORDPRESS_APP_PASSWORD');
  const hashnodeHost = requireEnv('NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST');

  const verifyOnly = hasFlag('--verify');
  const limitValue = getFlagValue('--limit');
  const limit = limitValue ? Number(limitValue) : undefined;

  if (limitValue && Number.isNaN(limit)) {
    throw new Error(`Invalid --limit value: ${limitValue}`);
  }

  console.log(`Connecting to WordPress site ${wpSite}...`);
  const tokenResponse = await getWordPressAccessToken({
    clientId: wpClientId,
    clientSecret: wpClientSecret,
    username: wpUsername,
    appPassword: wpAppPassword,
  });

  const [siteInfo, existingPosts, hashnodeData] = await Promise.all([
    getWordPressSiteInfo(wpSite),
    getAllWordPressPosts(wpSite, tokenResponse.access_token),
    fetchAllHashnodePosts(),
  ]);

  const existingSlugs = new Set(existingPosts.map((post) => post.slug));
  const sourcePosts = typeof limit === 'number' ? hashnodeData.posts.slice(0, limit) : hashnodeData.posts;
  const pendingPosts = sourcePosts.filter((post) => !existingSlugs.has(post.slug));

  console.log(`WordPress site: ${siteInfo.name} (${siteInfo.URL})`);
  console.log(`Hashnode publication: ${hashnodeData.publication?.title ?? hashnodeHost}`);
  console.log(`Existing WordPress posts: ${existingPosts.length}`);
  console.log(`Hashnode posts discovered: ${hashnodeData.posts.length}`);
  console.log(`Posts pending import: ${pendingPosts.length}`);

  if (pendingPosts.length > 0) {
    const sample = pendingPosts[0];
    console.log('Sample pending post:');
    console.log(`  Title: ${sample.title}`);
    console.log(`  Slug: ${sample.slug}`);
    console.log(`  Date: ${sample.publishedAt}`);
    console.log(`  Brief: ${summarize(sample.brief)}`);
  }

  if (verifyOnly) {
    console.log('Verification completed. No posts were created.');
    return;
  }

  let created = 0;
  let failed = 0;

  for (const post of pendingPosts) {
    try {
      const result = await createWordPressPost(wpSite, tokenResponse.access_token, {
        title: post.title,
        content: post.content.html || `<p>${post.brief}</p>`,
        excerpt: post.brief,
        slug: post.slug,
        date: post.publishedAt,
        status: 'publish',
        tags: post.tags?.map((tag) => tag.name) ?? [],
      });

      created += 1;
      console.log(`Created [${created}/${pendingPosts.length}] ${result.slug} -> ${result.URL}`);
    } catch (error) {
      failed += 1;
      console.error(`Failed to import "${post.slug}":`, error);
    }
  }

  console.log(`Import completed. Created: ${created}. Failed: ${failed}. Skipped existing: ${sourcePosts.length - pendingPosts.length}.`);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
