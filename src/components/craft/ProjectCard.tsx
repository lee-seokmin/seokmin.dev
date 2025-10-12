import Link from "next/link"
import Image from "next/image"
import { Project } from "@/types/Project"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group cursor-pointer">
      <Link href={project.url} target={project.state == "View More" ? "_blank" : "_self"}>
        <div className="relative overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
          <AspectRatio ratio={16 / 10}>
            <Image
              src={`/api/images/data/craft/${project.img}`}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white text-black backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                {project.state}
              </span>
            </div>
          </AspectRatio>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-chart-2 transition-colors duration-200">
              {project.name}
            </h3>
            <Badge
              variant="outline"
            >
              {project.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
      </Link>
    </div>
  )
}