'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types/Post';

const postsDirectory = path.join(process.cwd(), '_posts');

export async function getAllCategories(): Promise<string[]> {
  const categories = fs.readdirSync(postsDirectory);
  return categories.filter((category) => {
    const categoryPath = path.join(postsDirectory, category);
    return fs.statSync(categoryPath).isDirectory();
  });
}

export async function getPostsByCategory(category: string, sortBy?: string): Promise<Post[]> {
  const allPosts = await getAllPosts(sortBy);
  return allPosts.filter((post) => post.category === category);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

export async function getAllPosts(sortBy?: string): Promise<Post[]> {
  const categories = fs.readdirSync(postsDirectory);

  const allPosts: Post[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(postsDirectory, category);

    // Skip if not a directory
    if (!fs.statSync(categoryPath).isDirectory()) return;

    const posts = fs.readdirSync(categoryPath);

    posts.forEach((postDir) => {
      const postPath = path.join(categoryPath, postDir);

      // Skip if not a directory
      if (!fs.statSync(postPath).isDirectory()) return;

      const files = fs.readdirSync(postPath);
      const mdxFile = files.find((file) => file.endsWith('.mdx'));

      if (mdxFile) {
        const filePath = path.join(postPath, mdxFile);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Convert relative thumbnail path to absolute path
        let thumbnail = data.thumbnail || '';
        if (thumbnail && thumbnail.startsWith('./')) {
          thumbnail = `/_posts/${category}/${postDir}/${thumbnail.substring(2)}`;
        }

        const post: Post = {
          title: data.title || 'Untitled',
          description: data.description || '',
          thumbnail: thumbnail,
          create_at: data.createAt || data.create_at || new Date().toISOString(),
          category: category,
          tags: data.tags || '',
          slug: data.slug || postDir,
          content: content,
          best: data.best || false,
          subcategory: data.subcategory,
        };

        allPosts.push(post);
      }
    });
  });

  // Sort posts based on sortBy parameter
  switch (sortBy) {
    case 'newest':
      return allPosts.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
    case 'shortest':
      return allPosts.sort((a, b) => a.content.length - b.content.length);
    case 'longest':
      return allPosts.sort((a, b) => b.content.length - a.content.length);
    default:
      // Default to newest
      return allPosts.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
  }
}
