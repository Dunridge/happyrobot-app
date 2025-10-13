"use client";
import Link from "next/link";

interface Props {
  project: { id: string; name: string; description?: string };
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
        <h2 className="text-lg font-semibold">{project.name}</h2>
        {project.description && (
          <p className="text-gray-500">{project.description}</p>
        )}
      </div>
    </Link>
  );
}
