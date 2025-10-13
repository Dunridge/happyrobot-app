// import Image from "next/image";

/*
Next Steps
1. Connect components to Next.js API routes for fetching projects, tasks, and comments.
2. Add WebSocket updates in TaskBoard and TaskDetails for real-time changes.
3. Implement task creation, editing, and deletion UI.
4. Style for dark mode and responsive layouts.
5. Optionally add drag-and-drop for tasks between columns (Kanban style).
*/

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
      {/* Add Project form or button here */}
    </div>
  );
}
