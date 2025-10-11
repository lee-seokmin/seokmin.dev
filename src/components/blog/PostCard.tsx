import { Post } from "@/types/Post";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.create_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} className="bg-card flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-border">
      {/* Thumbnail */}
      {post.thumbnail && (
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-t-lg">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={75}
          />
        </AspectRatio>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4 justify-between p-6 flex-1">
        <div className="space-y-3">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">{post.category}</Badge>
            {post.best && (
              <Badge variant="destructive">⭐ 추천</Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-3">
            {post.description}
          </p>
        </div>

        <div className="space-y-4">
          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="chart-2"
                >
                  #{tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span>{Math.ceil(post.content.length / 500)}분 읽기</span>
          </div>
        </div>
      </div>
    </Link>
  );
}