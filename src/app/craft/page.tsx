import { getAllProjects, getProjectCategories } from "@/lib/projects"
import ProjectCard from "@/components/craft/ProjectCard"
import { CategoryFilterClientWrapper } from "@/components/craft/wrapper/CategoryFilterClientWrapper"

interface CraftPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CraftPage({ searchParams }: CraftPageProps) {
  const allProjects = getAllProjects();
  const allCategories = getProjectCategories();

  const searchParamsResolved = await searchParams;
  const selectedCategory = searchParamsResolved?.category || "";

  const filteredProjects = selectedCategory
    ? allProjects.filter(project => project.category === selectedCategory)
    : allProjects;

  return (
    <div className="py-24 space-y-8 max-w-6xl mx-auto">
      <div className="bg-foreground p-12 rounded-lg space-y-2 text-center">
        <h2 className="text-4xl font-bold text-background">Craft</h2>
        <span className="text-muted-foreground">My projects and experiences</span>
      </div>

      <div className="flex items-center justify-between">
        <CategoryFilterClientWrapper
          categories={allCategories}
          selectedCategory={selectedCategory}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {selectedCategory ? `선택한 카테고리에 프로젝트가 없습니다.` : `아직 생성된 프로젝트가 없습니다.`}
          </p>
        </div>
      )}
    </div>
  )
}