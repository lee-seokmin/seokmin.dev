import { Post } from "@/types/Post";
import PostCard from "@/components/blog/PostCard";

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">관련 포스트가 {posts.length}개 있어요.</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.slice(0, 4).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}