type Nullable<T> = T | null;

export interface WordPressAuthConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  appPassword: string;
}

export interface WordPressSiteConfig extends WordPressAuthConfig {
  site: string;
}

export interface WordPressTokenResponse {
  access_token: string;
  token_type: string;
  blog_id?: string;
  blog_url?: string;
  scope?: string;
}

export interface WordPressSiteInfo {
  ID: number;
  slug: string;
  name: string;
  URL: string;
  capabilities?: Record<string, boolean>;
}

export interface WordPressPostSummary {
  ID: number;
  slug: string;
  title: string;
  URL: string;
  status: string;
  date: string;
}

export interface WordPressPostsResponse {
  found: number;
  posts: WordPressPostSummary[];
  meta?: {
    next_page?: string;
  };
}

export interface WordPressCreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  date: string;
  status: 'publish' | 'draft' | 'pending' | 'private' | 'future';
  tags?: string[];
  categories?: string[];
}

export interface WordPressCreatePostResponse {
  ID: number;
  slug: string;
  status: string;
  date: string;
  URL: string;
  title: string;
}

const OAUTH_TOKEN_URL = 'https://public-api.wordpress.com/oauth2/token';
const API_BASE = 'https://public-api.wordpress.com/rest/v1.1';

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Expected JSON response but received: ${text.slice(0, 300)}`);
  }
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WordPress request failed (${response.status} ${response.statusText}): ${body.slice(0, 500)}`);
  }

  return readJson<T>(response);
}

export async function getWordPressAccessToken(config: WordPressAuthConfig): Promise<WordPressTokenResponse> {
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'password',
    username: config.username,
    password: config.appPassword,
  });

  return requestJson<WordPressTokenResponse>(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

export async function getWordPressSiteInfo(site: string): Promise<WordPressSiteInfo> {
  const url = `${API_BASE}/sites/${encodeURIComponent(site)}`;
  return requestJson<WordPressSiteInfo>(url);
}

export async function getAllWordPressPosts(
  site: string,
  token: string,
  status: string = 'any'
): Promise<WordPressPostSummary[]> {
  const posts: WordPressPostSummary[] = [];
  let pageHandle: Nullable<string> = null;

  do {
    const params = new URLSearchParams({
      number: '100',
      order_by: 'date',
      order: 'ASC',
      status,
      fields: 'ID,slug,title,URL,status,date',
    });

    if (pageHandle) {
      params.set('page_handle', pageHandle);
    }

    const url = `${API_BASE}/sites/${encodeURIComponent(site)}/posts/?${params.toString()}`;
    const data = await requestJson<WordPressPostsResponse>(url, {
      headers: authHeaders(token),
    });

    posts.push(...data.posts);
    pageHandle = data.meta?.next_page ?? null;
  } while (pageHandle);

  return posts;
}

export async function createWordPressPost(
  site: string,
  token: string,
  input: WordPressCreatePostInput
): Promise<WordPressCreatePostResponse> {
  const params = new URLSearchParams({
    title: input.title,
    content: input.content,
    slug: input.slug,
    date: input.date,
    status: input.status,
    publicize: 'false',
  });

  if (input.excerpt) {
    params.set('excerpt', input.excerpt);
  }

  if (input.tags?.length) {
    params.set('tags', input.tags.join(','));
  }

  if (input.categories?.length) {
    params.set('categories', input.categories.join(','));
  }

  const url = `${API_BASE}/sites/${encodeURIComponent(site)}/posts/new`;
  return requestJson<WordPressCreatePostResponse>(url, {
    method: 'POST',
    headers: authHeaders(token),
    body: params.toString(),
  });
}
