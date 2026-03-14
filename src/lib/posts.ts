'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { Post } from '@/types/Post';

const postsDirectory = path.join(process.cwd(), 'data', 'blog');

export async function getAllCategories(): Promise<string[]> {
  const categories = fs.readdirSync(postsDirectory);
  return categories.filter((category) => category !== "travel").filter((category) => {
    const categoryPath = path.join(postsDirectory, category);
    return fs.statSync(categoryPath).isDirectory();
  });
}

export async function getPostBySlug(slug: string) {
  const allPosts = await getAllPosts();
  const post = allPosts.find((post) => post.slug === slug);
  
  if (!post) return null;

  // Serialize the MDX content
  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      development: process.env.NODE_ENV === 'development',
    },
  });

  return {
    ...post,
    mdxSource,
  };
}

export async function getAllPosts(sortBy?: string): Promise<Post[]> {
  const categories = fs.readdirSync(postsDirectory);

  const allPosts: Post[] = [];

  categories.forEach((category) => {
    // Skip travel category
    if (category === "travel") return;
    
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
          thumbnail = `/data/blog/${category}/${postDir}/${thumbnail.substring(2)}`;
        }

        const post: Post = {
          title: data.title || 'Untitled',
          description: data.description || '',
          thumbnail: thumbnail,
          create_at: data.createAt || data.create_at || new Date().toISOString(),
          category: category,
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []),
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

export async function serializeMDX(content: string) {
  try {
    const mdxSource = await serialize(content, {
      parseFrontmatter: true,
    });
    return mdxSource;
  } catch (error) {
    console.error('Error serializing MDX:', error);
    return null;
  }
}
