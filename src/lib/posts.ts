import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { Post } from '@/types/Post';

const postsDirectory = path.join(process.cwd(), 'data', 'blog');

export async function getAllCategories(): Promise<string[]> {
  const categories = fs.readdirSync(postsDirectory);
  return categories.filter((category) => {
    const categoryPath = path.join(postsDirectory, category);
    return fs.statSync(categoryPath).isDirectory();
  });
}

export async function getPostBySlug(slug: string) {
  const allPosts = await getAllPosts();
  const post = allPosts.find((post) => post.slug === slug);
  
  if (!post) return null;

  const mdxSource = await serializeMDX(post.content, post.category, post.slug);

  return {
    ...post,
    mdxSource,
  };
}

export async function getAllPosts(sortBy?: string): Promise<Post[]> {
  const categories = fs.readdirSync(postsDirectory);

  const allPosts: Post[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(postsDirectory, category);

    if (!fs.statSync(categoryPath).isDirectory()) return;

    const posts = fs.readdirSync(categoryPath);

    posts.forEach((postDir) => {
      const postPath = path.join(categoryPath, postDir);

      if (!fs.statSync(postPath).isDirectory()) return;

      const files = fs.readdirSync(postPath);
      const mdxFile = files.find((file) => file.endsWith('.mdx'));

      if (mdxFile) {
        const filePath = path.join(postPath, mdxFile);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        let thumbnail = data.thumbnail || '';
        if (thumbnail && thumbnail.startsWith('./')) {
          const possibleThumbnailPath = path.join(postPath, thumbnail.substring(2));

          if (fs.existsSync(possibleThumbnailPath)) {
            thumbnail = `/api/images/${category}/${postDir}/${thumbnail.substring(2)}`;
          } else {
            thumbnail = '';
          }
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

  switch (sortBy) {
    case 'newest':
      return allPosts.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
    case 'shortest':
      return allPosts.sort((a, b) => a.content.length - b.content.length);
    case 'longest':
      return allPosts.sort((a, b) => b.content.length - a.content.length);
    default:
      return allPosts.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
  }
}

export async function serializeMDX(content: string, category?: string, postDir?: string) {
  try {
    let processedContent = content;

    // 상대경로(예: ./image.jpg)를 절대경로(/data/blog/category/postDir/...)로 변환
    processedContent = processedContent.replace(
      /(\.\.?\/[^"'\s)]+\.(jpg|jpeg|png|gif|webp|svg|mov|mp4))/g,
      (match, path) => {
        if (path.startsWith('./') && category && postDir) {
          return `/data/blog/${category}/${postDir}/${path.substring(2)}`;
        } else if (path.startsWith('../')) {
          // 상위 디렉토리 상대경로의 경우도 처리할 수 있지만 일단 기본 처리
          return `/data/blog/${path.substring(3)}`;
        }
        return path;
      }
    );

    // 기존 절대경로 변환 로직 (/data/blog/ 패턴)
    processedContent = processedContent.replace(
      /\/data\/blog\/([^"'\s)]+)/g,
      '/api/images/$1'
    );

    const mdxSource = await serialize(processedContent, {
      parseFrontmatter: true,
    });
    return mdxSource;
  } catch (error) {
    console.error('Error serializing MDX:', error);
    return null;
  }
}
