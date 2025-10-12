import NavBar from "@/components/navbar";
import Orb from "@/components/Orb";
import Footer from "@/components/footer";
import PostList from "@/components/blog/PostList";
import { getAllPosts } from "@/lib/posts";

// 게시물 4개만 가져오기 위해 비동기로 처리
async function getRecentPosts() {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, 4);
}

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <div className="bg-background space-y-24 px-3" style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <NavBar />

      <Orb
        hoverIntensity={1.2}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />

      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl lg:text-7xl font-black text-center">SEOKMIN.DEV</h1>

      <div className="max-w-6xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold">Recent Posts</h2>

        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostList key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
