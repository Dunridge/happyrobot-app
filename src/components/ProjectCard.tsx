"use client";
import Link from "next/link";

interface Props {
  project: { id: string; name: string; description?: string };
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-500 transition">
        {project.name}
      </h2>
      {project.description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {project.description}
        </p>
      )}
      <Link href={`/projects/${project.id}`}>
        <span className="w-full mt-2 inline-block text-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition font-medium shadow">
          Open Project
        </span>
      </Link>
    </div>
  );
}
