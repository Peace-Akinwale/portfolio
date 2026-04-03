const fs = require('fs');
const path = require('path');

const LOCAL_POST_COVER_FILES = {
  'what-i-learned-vibe-coding-my-first-app-shutting-it-down': path.resolve(process.cwd(), 'public/images/blog/garde-logo.jpg'),
  'how-to-build-portfolio-website-claude-code': path.resolve(process.cwd(), 'public/images/blog/second-thorough-prompt.png'),
};

const REMOTE_POST_COVER_OVERRIDES = {
  'content-manager-roles': 'https://cdn.hashnode.com/res/hashnode/image/upload/v1770064006865/7235e02a-f451-435f-abaa-e2dd163d2288.png',
  'best-3-ai-search-engines-that-answer-queries-like-chat-gpt': 'https://cdn.hashnode.com/res/hashnode/image/upload/v1722355856245/b82abafc-2bc1-4e73-a22a-27a86771b610.png',
  'linkedin-automation-and-social-selling': 'https://cdn.hashnode.com/res/hashnode/image/upload/v1720356403111/534ca0e3-ce4f-4bce-b9b9-131ac847a0a8.png',
  'create-editorial-style-guide-with-claude': 'https://cdn.hashnode.com/res/hashnode/image/upload/v1770062817824/f8071b8e-b17f-4efc-8d4b-b645c0ecb3b9.png',
};

const PAGE_PARENT_BY_SLUG = {
  'b2b-content-for-manyrequests': 'portfolio',
  'content-for-highervisibility': 'portfolio',
  'content-for-pangea': 'portfolio',
  'linkedin-router': 'projects',
  'mylinks': 'projects',
  'mystyleguide': 'projects',
  'portfolio-project': 'projects',
  'editorial-style-guide': 'projects',
};

const PAGE_MENU_ORDER = {
  home: 0,
  about: 1,
  portfolio: 2,
  projects: 3,
  blog: 4,
};

const POSTS_WITH_FORCED_LEAD_IMAGE = new Set([
  'what-i-learned-vibe-coding-my-first-app-shutting-it-down',
  'how-to-build-portfolio-website-claude-code',
  'content-manager-roles',
  'best-3-ai-search-engines-that-answer-queries-like-chat-gpt',
]);

function loadEnv(filePath) {
  const env = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
}

function required(env, key) {
  const value = env[key];
  if (!value) throw new Error(`Missing env var ${key}`);
  return value;
}

function decodeEntities(input) {
  return String(input || '')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function normalizePlainText(input) {
  return decodeEntities(input).replace(/\s+/g, ' ').trim();
}

function stripHtml(html) {
  return normalizePlainText(String(html || '').replace(/<[^>]+>/g, ' '));
}

function excerptFromHtml(html, limit = 220) {
  const text = stripHtml(html);
  return text.length <= limit ? text : `${text.slice(0, limit - 1).trim()}…`;
}

function summarize(text, limit = 180) {
  const normalized = normalizePlainText(text);
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1).trim()}…`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

function getBasenameFromUrl(url) {
  try {
    return path.basename(new URL(url).pathname);
  } catch {
    return null;
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

function buildResponsiveImageFigure(rawImgTag) {
  let attrs = rawImgTag
    .replace(/^<img\b/i, '')
    .replace(/\/?\s*>$/, '')
    .replace(/\s(width|height)=(["']).*?\2/gi, '')
    .replace(/\sclass=(["']).*?\1/gi, '')
    .replace(/\sstyle=(["']).*?\1/gi, '')
    .trim();

  attrs = attrs.replace(/\sloading=(["']).*?\1/gi, '').trim();

  return `<figure class="wp-block-image size-large"><img ${attrs} style="max-width:100%;height:auto;display:block;margin:0 auto;" loading="lazy" /></figure>`;
}

function normalizeContentHtml(html) {
  let output = String(html || '');

  output = output.replace(/<p>\s*(<img\b[^>]*\/?>)\s*<\/p>/gi, (_, imgTag) => buildResponsiveImageFigure(imgTag));
  output = output.replace(/<img\b[^>]*\/?>/gi, (imgTag) => buildResponsiveImageFigure(imgTag));
  output = output.replace(/<a([^>]+)target="_blank"([^>]*)>/gi, '<a$1target="_blank" rel="noopener noreferrer"$2>');
  output = output.replace(/\srel="noopener noreferrer"\srel="noopener noreferrer"/gi, ' rel="noopener noreferrer"');
  return output;
}

function extractFirstImageUrl(html) {
  const match = String(html || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function buildHomePageHtml() {
  return `
    <h1>Peace Akinwale</h1>
    <p>I write clear, product-led content for B2B SaaS companies and build practical systems around the writing process.</p>
    <p>This WordPress site powers my publishing workflow. The main website lives at <a href="https://peaceakinwale.com/">peaceakinwale.com</a>.</p>
    <h2>Quick links</h2>
    <ul>
      <li><a href="https://peaceakinwale.com/">Visit the main website</a></li>
      <li><a href="/blog/">Browse the blog archive</a></li>
      <li><a href="/portfolio/">View portfolio pages</a></li>
      <li><a href="/projects/">View projects</a></li>
      <li><a href="/about/">Read the about page</a></li>
    </ul>
  `.trim();
}

function buildBlogPageHtml(posts) {
  const items = posts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      const title = normalizePlainText(post.title);
      const excerpt = summarize(post.excerpt || post.content || '');
      const canonicalUrl = `https://peaceakinwale.com/${post.slug}`;
      return `
        <li>
          <p><strong><a href="${canonicalUrl}">${title}</a></strong><br />${formatDate(post.date)}</p>
          <p>${excerpt}</p>
        </li>
      `.trim();
    })
    .join('\n');

  return `
    <h1>Blog</h1>
    <p>This is the publishing archive for my articles. The canonical reading experience is on <a href="https://peaceakinwale.com/blog">peaceakinwale.com/blog</a>.</p>
    <ul>
      ${items}
    </ul>
  `.trim();
}

function buildLeadImageFigure(url, alt) {
  return `<figure class="wp-block-image size-large"><img src="${url}" alt="${String(alt || '').replace(/"/g, '&quot;')}" style="max-width:100%;height:auto;display:block;margin:0 auto;" loading="lazy" /></figure>`;
}

function ensureLeadImage(html, imageUrl, title) {
  const content = String(html || '');
  if (!imageUrl) return content;

  const firstChunk = content.slice(0, 800);
  if (firstChunk.includes(imageUrl)) {
    return content;
  }

  return `${buildLeadImageFigure(imageUrl, title)}\n${content}`.trim();
}

async function requestJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 300)}`);
  }
  if (!response.ok) {
    throw new Error(`Request failed ${response.status} ${response.statusText} for ${url}: ${text.slice(0, 400)}`);
  }
  return data;
}

async function getWpToken(env) {
  const params = new URLSearchParams({
    client_id: required(env, 'WORDPRESS_CLIENT_ID'),
    client_secret: required(env, 'WORDPRESS_CLIENT_SECRET'),
    grant_type: 'password',
    username: required(env, 'WORDPRESS_USERNAME'),
    password: required(env, 'WORDPRESS_APP_PASSWORD'),
  });

  return requestJson('https://public-api.wordpress.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
}

function wpHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

async function getAllWpItems(site, token, type = 'post', fields = 'ID,slug,title,URL,status,date,content,excerpt,featured_image,attachments,tags,parent,menu_order') {
  const items = [];
  let nextPage = null;

  do {
    const params = new URLSearchParams({
      type,
      number: '100',
      order_by: 'date',
      order: 'ASC',
      status: 'any',
      fields,
    });

    if (nextPage) params.set('page_handle', nextPage);

    const data = await requestJson(`https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(site)}/posts/?${params.toString()}`, {
      headers: wpHeaders(token),
    });

    items.push(...data.posts);
    nextPage = data.meta && data.meta.next_page ? data.meta.next_page : null;
  } while (nextPage);

  return items;
}

async function updateWpPost(site, token, id, payload) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    params.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }

  return requestJson(`https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(site)}/posts/${id}`, {
    method: 'POST',
    headers: wpHeaders(token),
    body: params.toString(),
  });
}

async function createWpPost(site, token, payload) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    params.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }

  return requestJson(`https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(site)}/posts/new`, {
    method: 'POST',
    headers: wpHeaders(token),
    body: params.toString(),
  });
}

async function fetchHashnodeStaticPages(env) {
  const headers = { 'Content-Type': 'application/json' };
  if (env.HASHNODE_API_TOKEN) headers.Authorization = env.HASHNODE_API_TOKEN;

  const query = `
    query GetStaticPagesForMigration($host: String!) {
      publication(host: $host) {
        staticPages(first: 50) {
          edges {
            node {
              id
              slug
              title
              content {
                html
              }
            }
          }
        }
      }
    }
  `;

  const data = await requestJson('https://gql.hashnode.com', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: { host: required(env, 'NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST') },
    }),
  });

  if (data.errors && data.errors.length) {
    throw new Error(data.errors.map((error) => error.message).join('; '));
  }

  return data.data.publication.staticPages.edges.map((edge) => edge.node);
}

async function fetchHashnodePosts(env) {
  const headers = { 'Content-Type': 'application/json' };
  if (env.HASHNODE_API_TOKEN) headers.Authorization = env.HASHNODE_API_TOKEN;

  const query = `
    query GetPostsForWordPressFix($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              slug
              title
              brief
              publishedAt
              coverImage {
                url
              }
              seo {
                title
                description
              }
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

  const posts = [];
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await requestJson('https://gql.hashnode.com', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: {
          host: required(env, 'NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST'),
          first: 20,
          after,
        },
      }),
    });

    if (data.errors && data.errors.length) {
      throw new Error(data.errors.map((error) => error.message).join('; '));
    }

    const connection = data.data.publication.posts;
    posts.push(...connection.edges.map((edge) => edge.node));
    hasNextPage = connection.pageInfo.hasNextPage;
    after = connection.pageInfo.endCursor || null;
  }

  return posts;
}

function findAttachmentIdByNeedle(post, needle) {
  if (!needle || !post.attachments) return null;

  for (const [id, attachment] of Object.entries(post.attachments)) {
    const url = String(attachment.URL || '');
    const title = String(attachment.title || '');
    if (url.includes(needle) || title.includes(needle)) {
      return Number(id);
    }
  }

  return null;
}

async function uploadLocalMediaToPost(site, token, postId, filePath) {
  const formData = new FormData();
  const file = fs.readFileSync(filePath);
  const blob = new Blob([file], { type: getMimeType(filePath) });
  formData.append('media[]', blob, path.basename(filePath));

  const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(site)}/posts/${postId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Media upload returned non-JSON response: ${text.slice(0, 300)}`);
  }

  if (!response.ok) {
    throw new Error(`Media upload failed (${response.status} ${response.statusText}): ${text.slice(0, 400)}`);
  }

  return data;
}

async function ensureFeaturedImage(site, token, post, target) {
  if (!target) return false;

  const needle = target.type === 'local' ? path.basename(target.value) : getBasenameFromUrl(target.value);

  if (needle && post.featured_image && post.featured_image.includes(needle)) {
    return false;
  }

  const existingAttachmentId = findAttachmentIdByNeedle(post, needle);
  if (existingAttachmentId) {
    await updateWpPost(site, token, post.ID, { featured_image: existingAttachmentId });
    return true;
  }

  const updated = target.type === 'local'
    ? await uploadLocalMediaToPost(site, token, post.ID, target.value)
    : await updateWpPost(site, token, post.ID, { media_urls: [target.value] });

  const attachmentIds = Object.keys(updated.attachments || {}).map(Number).sort((a, b) => a - b);
  const matchedAttachmentId =
    (needle ? findAttachmentIdByNeedle(updated, needle) : null) ||
    attachmentIds[attachmentIds.length - 1];

  if (!matchedAttachmentId) {
    throw new Error(`Could not determine uploaded attachment for post ${post.slug}`);
  }

  await updateWpPost(site, token, post.ID, { featured_image: matchedAttachmentId });
  post.attachments = updated.attachments || post.attachments;
  post.featured_image = updated.attachments?.[matchedAttachmentId]?.URL || post.featured_image;
  return true;
}

async function main() {
  const env = loadEnv(path.resolve(process.cwd(), '.env.local'));
  const site = required(env, 'WORDPRESS_SITE');
  const tokenData = await getWpToken(env);
  const token = tokenData.access_token;

  console.log(`Connected to ${site}`);

  const [posts, pages, hashnodePages, hashnodePosts] = await Promise.all([
    getAllWpItems(site, token, 'post'),
    getAllWpItems(site, token, 'page'),
    fetchHashnodeStaticPages(env),
    fetchHashnodePosts(env),
  ]);

  const hashnodePostsBySlug = new Map(hashnodePosts.map((post) => [post.slug, post]));

  console.log(`WordPress posts: ${posts.length}`);
  console.log(`WordPress pages: ${pages.length}`);
  console.log(`Hashnode static pages: ${hashnodePages.length}`);

  let normalizedPosts = 0;
  let excerptsUpdated = 0;
  let featuredImagesSet = 0;

  for (const post of posts) {
    const hashnodePost = hashnodePostsBySlug.get(post.slug);
    const original = String(post.content || '');
    const normalized = normalizeContentHtml(original);
    const firstImage = extractFirstImageUrl(normalized);
    const desiredExcerpt = normalizePlainText(hashnodePost?.seo?.description || hashnodePost?.brief || excerptFromHtml(normalized));
    const payload = {};

    if (normalized !== original) {
      payload.content = normalized;
      normalizedPosts += 1;
    }

    if (desiredExcerpt && desiredExcerpt !== normalizePlainText(post.excerpt || '')) {
      payload.excerpt = desiredExcerpt;
      excerptsUpdated += 1;
    }

    if (!post.featured_image && firstImage) {
      payload.media_urls = [firstImage];
    }

    if (Object.keys(payload).length > 0) {
      const updated = await updateWpPost(site, token, post.ID, payload);
      post.content = updated.content || post.content;
      post.excerpt = updated.excerpt || post.excerpt;
      post.attachments = updated.attachments || post.attachments;
      post.featured_image = updated.featured_image || post.featured_image;
      console.log(`Updated post content/excerpt: ${post.slug}`);
    }
  }

  for (const post of posts) {
    const localCoverPath = LOCAL_POST_COVER_FILES[post.slug];
    const remoteCoverUrl = REMOTE_POST_COVER_OVERRIDES[post.slug] || hashnodePostsBySlug.get(post.slug)?.coverImage?.url;
    const target = localCoverPath
      ? { type: 'local', value: localCoverPath }
      : remoteCoverUrl
        ? { type: 'remote', value: remoteCoverUrl }
        : null;

    if (!target) continue;

    const changed = await ensureFeaturedImage(site, token, post, target);
    if (changed) {
      featuredImagesSet += 1;
      console.log(`Updated featured image: ${post.slug}`);
    }

    if (POSTS_WITH_FORCED_LEAD_IMAGE.has(post.slug) && post.featured_image) {
      const withLeadImage = ensureLeadImage(post.content || '', post.featured_image, post.title);
      if (normalizePlainText(withLeadImage) !== normalizePlainText(post.content || '')) {
        const updated = await updateWpPost(site, token, post.ID, {
          content: withLeadImage,
          excerpt: normalizePlainText(hashnodePostsBySlug.get(post.slug)?.seo?.description || hashnodePostsBySlug.get(post.slug)?.brief || excerptFromHtml(withLeadImage)),
        });
        post.content = updated.content || withLeadImage;
        post.excerpt = updated.excerpt || post.excerpt;
        console.log(`Prepended lead image: ${post.slug}`);
      }
    }
  }

  let createdPages = 0;
  let updatedPages = 0;

  for (const page of hashnodePages) {
    const normalized = normalizeContentHtml(page.content.html || '');
    const existingPage = pages.find((item) => item.slug === page.slug);
    const payload = {
      type: 'page',
      title: decodeEntities(page.title),
      content: normalized,
      excerpt: excerptFromHtml(normalized),
      slug: page.slug,
      status: 'publish',
    };

    if (existingPage) {
      if (normalizePlainText(existingPage.content || '') !== normalizePlainText(normalized) || normalizePlainText(existingPage.title || '') !== normalizePlainText(page.title)) {
        await updateWpPost(site, token, existingPage.ID, payload);
        updatedPages += 1;
        console.log(`Updated page: ${page.slug}`);
      }
      continue;
    }

    await createWpPost(site, token, payload);
    createdPages += 1;
    console.log(`Created page: ${page.slug}`);
  }

  const refreshedPages = await getAllWpItems(site, token, 'page');
  const pagesBySlug = new Map(refreshedPages.map((page) => [page.slug, page]));

  let hierarchyUpdates = 0;

  for (const [childSlug, parentSlug] of Object.entries(PAGE_PARENT_BY_SLUG)) {
    const child = pagesBySlug.get(childSlug);
    const parent = pagesBySlug.get(parentSlug);
    if (!child || !parent) continue;

    const currentParent = Number(child.parent?.ID || child.parent || 0);
    if (currentParent !== parent.ID) {
      await updateWpPost(site, token, child.ID, { parent: parent.ID });
      hierarchyUpdates += 1;
      console.log(`Re-parented page: ${childSlug} -> ${parentSlug}`);
    }
  }

  for (const [slug, order] of Object.entries(PAGE_MENU_ORDER)) {
    const page = pagesBySlug.get(slug);
    if (!page) continue;

    if (Number(page.menu_order || 0) !== order) {
      await updateWpPost(site, token, page.ID, { menu_order: order });
      hierarchyUpdates += 1;
      console.log(`Updated page order: ${slug}`);
    }
  }

  const homePage = pagesBySlug.get('home');
  if (homePage) {
    const desiredHomeHtml = buildHomePageHtml();
    if (normalizePlainText(homePage.content || '') !== normalizePlainText(desiredHomeHtml)) {
      await updateWpPost(site, token, homePage.ID, {
        content: desiredHomeHtml,
        excerpt: 'Home page for the WordPress publishing backend.',
      });
      updatedPages += 1;
      console.log('Updated page: home');
    }
  }

  const blogPage = pagesBySlug.get('blog');
  if (blogPage) {
    const desiredBlogHtml = buildBlogPageHtml(posts);
    if (normalizePlainText(blogPage.content || '') !== normalizePlainText(desiredBlogHtml)) {
      await updateWpPost(site, token, blogPage.ID, {
        content: desiredBlogHtml,
        excerpt: 'Archive of published articles by Peace Akinwale.',
      });
      updatedPages += 1;
      console.log('Updated page: blog');
    }
  }

  console.log(`Cleanup complete. Posts normalized: ${normalizedPosts}. Excerpts updated: ${excerptsUpdated}. Featured images set: ${featuredImagesSet}. Pages created: ${createdPages}. Pages updated: ${updatedPages}. Hierarchy updates: ${hierarchyUpdates}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
