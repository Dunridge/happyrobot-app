"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  dependencies: string[];
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
  const [newTaskDependencies, setNewTaskDependencies] = useState<string[]>([]);

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

  const addTask = async (task: Omit<Task, "id">) => {
    const tempTask: Task = { id: crypto.randomUUID(), ...task };
    setTasks((prev) => [...prev, tempTask]);
    // the dependencies array is sent here but the task is not updated on the backend

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

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const prevTask = tasks.find((t) => t.id === taskId);
    if (!prevTask) return;

    const updatedTask = { ...prevTask, ...updates };
    // TODO: figure out why it is not passing dependencies here
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? prevTask : t)));
    }
  };

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

      <div className="mt-4 flex gap-2">
        <div className="flex flex-col flex-1">
          <label htmlFor="new-task-title" className="mb-1 font-medium">
            Task Title
          </label>
          <input
            id="new-task-title"
            type="text"
            placeholder="Enter task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="new-task-dependencies" className="mb-1 font-medium">
            Dependencies
          </label>
          <select
            id="new-task-dependencies"
            multiple
            value={newTaskDependencies}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setNewTaskDependencies(selected);
            }}
            className="border p-2 w-full"
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            if (newTaskTitle.trim()) {
              addTask({
                title: newTaskTitle,
                status: "todo",
                dependencies: newTaskDependencies,
              });
              setNewTaskTitle("");
              setNewTaskDependencies([]);
            }
          }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
