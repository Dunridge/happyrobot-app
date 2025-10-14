"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";
import toast from "react-hot-toast";
import Select from "react-select";
import { Project, Task } from "@/types/types";

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
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? prevTask : t)));
        toast.error(errorData.error || "Failed to update task");
      } else {
        const savedTask = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? savedTask : t)));
      }
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? prevTask : t)));
      alert("Network error: failed to update task");
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

  // TODO: add a spinner loader here
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
            Depends on
          </label>
          <Select
            isMulti
            options={tasks.map((t) => ({ value: t.id, label: t.title }))}
            value={tasks
              .filter((t) => newTaskDependencies.includes(t.id))
              .map((t) => ({ value: t.id, label: t.title }))}
            onChange={(selected) => {
              setNewTaskDependencies(selected.map((s) => s.value));
            }}
          />
        </div>

        <button
          onClick={() => {
            if (newTaskTitle.trim()) {
              addTask({
                title: newTaskTitle,
                status: "todo",
                dependencies: newTaskDependencies,
                projectId: projectId as string,
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
