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
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Fetch project & tasks on mount
  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then(setProject)
      .catch(console.error);

    fetch(`/api/projects/${projectId}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);
  }, [projectId]);

  // Add new task (optimistic)
  const addTask = async (task: Omit<Task, "id">) => {
    const tempTask: Task = { id: crypto.randomUUID(), ...task };
    setTasks((prev) => [...prev, tempTask]);

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const savedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? savedTask : t))
      );
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
    }
  };

  // Update a task (optimistic)
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const prevTask = tasks.find((t) => t.id === taskId);
    if (!prevTask) return;

    const updatedTask = { ...prevTask, ...updates };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setTasks((prev) => prev.map((t) => (t.id === taskId ? prevTask : t)));
    }
  };

  // Delete a task (optimistic)
  const deleteTask = async (taskId: string) => {
    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
      setTasks(prevTasks);
    }
  };

  if (!project) return <div>Loading project...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      {project.description && <p className="mb-4">{project.description}</p>}

      <TaskBoard
        tasks={tasks}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />

      {/* Add new task */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={() => {
            if (newTaskTitle.trim()) {
              addTask({ title: newTaskTitle, status: "todo" });
              setNewTaskTitle("");
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
