"use client";
import Link from "next/link";
import Image from "next/image";
import trashIcon from "@/assets/trash.svg";

type Props = {
  project: { id: string; name: string; description?: string };
  handleDeleteProject: () => void;
};

export default function ProjectCard({ project, handleDeleteProject }: Props) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-white to-gray-50 border border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {project.name}
        </h2>

        <Image
          onClick={handleDeleteProject}
          className="cursor-pointer"
          width={22}
          height={22}
          src={trashIcon}
          alt="Trash icon"
        />
      </div>

      {project.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>
      )}

      <Link href={`/projects/${project.id}`} className="mt-4">
        <span className="inline-flex items-center justify-center w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-all group-hover:gap-2">
          Open Project
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M9.33464 12L8.4013 11.0333L10.768 8.66667H2.66797V7.33333H10.768L8.4013 4.96667L9.33464 4L13.3346 8L9.33464 12Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}
