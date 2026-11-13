// A WordPress.com post or page, in the shape the site renders.
// Loaded from the public REST API (WORDPRESS_SITE). Hashnode is not used.

export interface WordPressPost {
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

export interface WordPressPage {
  id: string;
  title: string;
  slug: string;
  content: {
    markdown: string;
    html: string;
  };
}
