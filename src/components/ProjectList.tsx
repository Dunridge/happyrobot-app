"use client";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface Props {
  projects: Project[];
}

export default function ProjectList({ projects }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
