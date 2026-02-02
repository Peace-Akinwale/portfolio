// Hashnode GraphQL Queries

export const GET_PUBLICATION = `
  query GetPublication($host: String!) {
    publication(host: $host) {
      id
      title
      about {
        markdown
        html
      }
      author {
        name
        profilePicture
        bio {
          text
        }
        socialMediaLinks {
          twitter
          linkedin
          github
        }
      }
    }
  }
`;

export const GET_POSTS = `
  query GetPosts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        edges {
          node {
            id
            title
            brief
            slug
            content {
              markdown
              html
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
              profilePicture
              bio {
                text
              }
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

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        title
        brief
        slug
        content {
          markdown
          html
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
          profilePicture
          bio {
            text
          }
        }
        seo {
          title
          description
        }
        url
      }
    }
  }
`;

export const GET_STATIC_PAGE = `
  query GetStaticPage($host: String!, $slug: String!) {
    publication(host: $host) {
      staticPage(slug: $slug) {
        id
        title
        slug
        content {
          markdown
          html
        }
      }
    }
  }
`;

export const SEARCH_POSTS = `
  query SearchPosts($host: String!, $first: Int!, $filter: PublicationPostConnectionFilter!) {
    publication(host: $host) {
      posts(first: $first, filter: $filter) {
        edges {
          node {
            id
            title
            brief
            slug
            coverImage {
              url
            }
            publishedAt
            readTimeInMinutes
            tags {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;
