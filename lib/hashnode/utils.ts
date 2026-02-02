import { format, formatDistanceToNow } from 'date-fns';
import type { HashnodePost } from './types';

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string, formatString: string = 'MMM dd, yyyy'): string {
  try {
    const date = new Date(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return dateString;
  }
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 minute read';
  return `${minutes} min read`;
}

/**
 * Generate excerpt from post content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');

  if (text.length <= maxLength) return text;

  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Get post URL (using custom domain or Hashnode URL)
 */
export function getPostUrl(slug: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}/${slug}`;
  }
  return `/${slug}`;
}

/**
 * Group posts by month/year
 */
export function groupPostsByDate(posts: HashnodePost[]): Record<string, HashnodePost[]> {
  return posts.reduce((acc, post) => {
    const date = new Date(post.publishedAt);
    const key = format(date, 'MMMM yyyy');

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(post);
    return acc;
  }, {} as Record<string, HashnodePost[]>);
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: HashnodePost[], ascending: boolean = false): HashnodePost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag(posts: HashnodePost[], tagSlug: string): HashnodePost[] {
  return posts.filter((post) =>
    post.tags?.some((tag) => tag.slug === tagSlug)
  );
}

/**
 * Get unique tags from posts
 */
export function getUniqueTags(posts: HashnodePost[]) {
  const tagMap = new Map();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      if (!tagMap.has(tag.slug)) {
        tagMap.set(tag.slug, tag);
      }
    });
  });

  return Array.from(tagMap.values());
}
