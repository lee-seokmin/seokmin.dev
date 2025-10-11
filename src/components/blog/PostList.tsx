import { Post } from "@/types/Post";
import Link from "next/link";

interface PostListProps {
  post: Post;
}

export default function PostList({ post }: PostListProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="bg-transparent hover:bg-card border border-border rounded-lg overflow-hidden shadow-sm transition-all duration-200 cursor-pointer">
      <div className="p-4 space-y-2">
        <h3 className="text-lg text-foreground font-semibold">{post.title}</h3>
        <p className="text-sm text-muted-foreground">{post.description}</p>
      </div>
    </Link>
  );
}