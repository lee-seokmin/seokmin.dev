import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import BlogContentWrapper from '@/components/blog/BlogContentWrapper';
import { Badge } from '@/components/ui/badge';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Comment from '@/components/blog/Comment';
import { Calendar, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://seokmin.dev'),
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}`],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch all posts to find related ones
  const allPosts = await getAllPosts();

  // Find related posts based on shared tags and category
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug) // Exclude current post
    .map((p) => {
      // Calculate relevance score based on shared tags and category
      let score = 0;
      const sharedTags = p.tags.filter(tag => post.tags.includes(tag));
      if (sharedTags.length > 0) score += sharedTags.length * 2; // Tags are worth more
      if (p.category === post.category) score += 1; // Category match is worth less

      return { post: p, score };
    })
    .filter(item => item.score > 0) // Only include posts with some relevance
    .sort((a, b) => b.score - a.score) // Sort by relevance score
    .slice(0, 4) // Take top 4
    .map(item => item.post); // Extract the post objects

  const formattedDate = new Date(post.create_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="py-24">
      <div className="max-w-5xl mx-auto px-3">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{post.category}</Badge>
            {post.best && (
              <Badge variant="destructive">⭐ 추천</Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {post.description}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{Math.ceil(post.content.length / 500)}분 읽기</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <BlogContentWrapper 
          mdxSource={post.mdxSource} 
          content={post.content}
          thumbnail={post.thumbnail}
        />

        {/* Tags */}
        {post.tags && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">태그</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="chart-2"
                >
                  #{tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}

        {/* Comment */}
        <Comment className="mt-12" />
      </div>
    </article>
  );
}
