import { GraphQLClient } from 'graphql-request';
import {
  GET_PUBLICATION,
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_STATIC_PAGE,
  SEARCH_POSTS,
} from './queries';
import type {
  HashnodePost,
  HashnodePublication,
  HashnodeStaticPage,
  PostsResponse,
  PostResponse,
  PublicationResponse,
  StaticPageResponse,
} from './types';

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const PUBLICATION_HOST = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST!;
const API_TOKEN = process.env.HASHNODE_API_TOKEN;

// Create GraphQL client
const client = new GraphQLClient(HASHNODE_API_URL, {
  headers: API_TOKEN
    ? {
        Authorization: API_TOKEN,
      }
    : {},
});

/**
 * Fetch publication information
 */
export async function getPublication(): Promise<HashnodePublication | null> {
  try {
    const data = await client.request<PublicationResponse>(GET_PUBLICATION, {
      host: PUBLICATION_HOST,
    });
    return data.publication;
  } catch (error) {
    console.error('Error fetching publication:', error);
    return null;
  }
}

/**
 * Fetch all posts with pagination
 */
export async function getPosts(
  first: number = 10,
  after?: string
): Promise<{ posts: HashnodePost[]; hasNextPage: boolean; endCursor?: string }> {
  try {
    const data = await client.request<PostsResponse>(GET_POSTS, {
      host: PUBLICATION_HOST,
      first,
      after,
    });

    const posts = data.publication.posts.edges.map((edge) => edge.node);
    const pageInfo = data.publication.posts.pageInfo;

    return {
      posts,
      hasNextPage: pageInfo.hasNextPage,
      endCursor: pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], hasNextPage: false };
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<HashnodePost | null> {
  try {
    const data = await client.request<PostResponse>(GET_POST_BY_SLUG, {
      host: PUBLICATION_HOST,
      slug,
    });
    return data.publication.post;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all posts (for generating static paths)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const allPosts: HashnodePost[] = [];
  let hasNextPage = true;
  let after: string | undefined;

  try {
    while (hasNextPage) {
      const { posts, hasNextPage: hasMore, endCursor } = await getPosts(20, after);
      allPosts.push(...posts);
      hasNextPage = hasMore;
      after = endCursor;
    }

    return allPosts.map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching all post slugs:', error);
    return [];
  }
}

/**
 * Fetch a static page by slug
 */
export async function getStaticPage(slug: string): Promise<HashnodeStaticPage | null> {
  try {
    const data = await client.request<StaticPageResponse>(GET_STATIC_PAGE, {
      host: PUBLICATION_HOST,
      slug,
    });
    return data.publication.staticPage;
  } catch (error) {
    console.error(`Error fetching static page with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string): Promise<HashnodePost[]> {
  try {
    const data = await client.request<PostsResponse>(SEARCH_POSTS, {
      host: PUBLICATION_HOST,
      first: 50,
      filter: {
        query,
      },
    });

    return data.publication.posts.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}
