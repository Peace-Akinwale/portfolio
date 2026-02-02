// Test script to verify Hashnode API connection
// Run with: npx ts-node scripts/test-hashnode.ts

import { getPublication, getPosts } from '../lib/hashnode/client';

async function testHashnodeAPI() {
  console.log('Testing Hashnode API connection...\n');

  // Test 1: Fetch publication info
  console.log('1. Fetching publication info...');
  const publication = await getPublication();

  if (publication) {
    console.log('✓ Publication found:');
    console.log(`  Title: ${publication.title}`);
    console.log(`  Author: ${publication.author.name}`);
    console.log('');
  } else {
    console.log('✗ Failed to fetch publication\n');
    return;
  }

  // Test 2: Fetch posts
  console.log('2. Fetching posts...');
  const { posts, hasNextPage } = await getPosts(5);

  if (posts.length > 0) {
    console.log(`✓ Found ${posts.length} posts:`);
    posts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title}`);
      console.log(`     Slug: ${post.slug}`);
      console.log(`     Published: ${new Date(post.publishedAt).toLocaleDateString()}`);
    });
    console.log(`  Has more posts: ${hasNextPage}`);
    console.log('');
  } else {
    console.log('✗ No posts found\n');
    return;
  }

  console.log('✓ All tests passed! Hashnode API is working correctly.');
}

testHashnodeAPI().catch((error) => {
  console.error('Error testing Hashnode API:', error);
  process.exit(1);
});
