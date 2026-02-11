// Hashnode API Types

export interface HashnodePost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  content: {
    markdown: string;
    html: string;
  };
  coverImage?: {
    url: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTimeInMinutes: number;
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  author: {
    name: string;
    profilePicture?: string;
    bio?: {
      text: string;
    };
  };
  seo?: {
    title?: string;
    description?: string;
  };
  url: string;
}

export interface HashnodeStaticPage {
  id: string;
  title: string;
  slug: string;
  content: {
    markdown: string;
    html: string;
  };
}

export interface HashnodePublication {
  id: string;
  title: string;
  about?: {
    markdown: string;
    html: string;
  };
  author: {
    name: string;
    profilePicture?: string;
    bio?: {
      text: string;
    };
    socialMediaLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
  posts: {
    edges: {
      node: HashnodePost;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}

export interface PostsResponse {
  publication: {
    posts: {
      edges: {
        node: HashnodePost;
      }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string;
      };
    };
  };
}

export interface PostResponse {
  publication: {
    post: HashnodePost | null;
  };
}

export interface PublicationResponse {
  publication: HashnodePublication | null;
}

export interface StaticPageResponse {
  publication: {
    staticPage: HashnodeStaticPage | null;
  };
}

export interface StaticPagesResponse {
  publication: {
    staticPages: {
      edges: {
        node: {
          id: string;
          slug: string;
        };
      }[];
    };
  };
}
