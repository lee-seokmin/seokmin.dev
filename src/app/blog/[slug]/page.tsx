import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import MDXContent from '@/components/blog/MDXContent';
import { Badge } from '@/components/ui/badge';

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
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: `/api/og?title=${post.title}&description=${post.description}`,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.create_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="py-24">
      <div className="max-w-5xl mx-auto">
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
            <span>{formattedDate}</span>
            <span>{Math.ceil(post.content.length / 500)}분 읽기</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MDXContent mdxSource={post.mdxSource} />
        </div>

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
      </div>
    </article>
  );
}
