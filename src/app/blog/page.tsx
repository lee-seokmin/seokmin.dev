import { getAllPosts, getAllCategories } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import { CategoryFilterClientWrapper } from '@/components/blog/wrapper/CategoryFilterClientWrapper';
import { SortClientWrapper } from '@/components/blog/wrapper/SortClientWrapper';

interface BlogPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const allCategories = await getAllCategories();

  const searchParamsResolved = await searchParams;
  const selectedCategory = searchParamsResolved?.category || "";
  const selectedSort = searchParamsResolved?.sort || "";

  const sortedPosts = await getAllPosts(selectedSort);

  const filteredPosts = selectedCategory
    ? sortedPosts.filter(post => post.category === selectedCategory)
    : sortedPosts;

  return (
    <div className="py-24 space-y-8 max-w-6xl mx-auto">
      <header className="bg-foreground p-12 rounded-lg space-y-2 text-center">
        <h2 className="text-4xl font-bold text-background">Blog</h2>
        <span className="text-muted-foreground">My thoughts and experiences</span>
      </header>

      <div className="flex items-center justify-between">
        <CategoryFilterClientWrapper
          categories={allCategories}
          selectedCategory={selectedCategory}
        />
        <SortClientWrapper selectedSortOption={selectedSort} />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {selectedCategory ? `선택한 카테고리에 포스트가 없습니다.` : `아직 작성된 포스트가 없습니다.`}
          </p>
        </div>
      )}
    </div>
  );
}