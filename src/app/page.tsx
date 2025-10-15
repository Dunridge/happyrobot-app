"use client";
import { useEffect, useState } from "react";
import ProjectList from "@/components/ProjectList";

interface Project {
  id: string;
  name: string;
  description?: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  console.log("projects", projects);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <ProjectList projects={projects} />
    </div>
  );
}
