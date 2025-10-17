"use client";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  description?: string;
}

type Props = {
  projects: Project[];
  handleDeleteProject: (projectId: string) => void;
};

export default function ProjectList({ projects, handleDeleteProject }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          handleDeleteProject={() => handleDeleteProject(project.id)}
        />
      ))}
    </div>
  );
}
