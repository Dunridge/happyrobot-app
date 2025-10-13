"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then(setProject)
      .catch(console.error);

    fetch(`/api/projects/${projectId}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);

    // TODO: add WebSocket listener for task updates
  }, [projectId]);

  if (!project) return <div>Loading project...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      {project.description && <p className="mb-4">{project.description}</p>}
      <TaskBoard tasks={tasks} />
      {/* Add button to create a new task */}
    </div>
  );
}
