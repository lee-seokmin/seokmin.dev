import fs from 'fs';
import path from 'path';
import { Project } from '@/types/Project';

export function getAllProjects(): Project[] {
    const projectsDirectory = path.join(process.cwd(), 'data', 'craft', 'projects.json');
    const fileContents = fs.readFileSync(projectsDirectory, 'utf8');
    const projects: Project[] = JSON.parse(fileContents);
    return projects;
}

export function getProjectCategories(): string[] {
    const projects = getAllProjects();
    const categories = projects.map((project) => project.category);
    return categories.filter((category, index) => categories.indexOf(category) === index);
}
