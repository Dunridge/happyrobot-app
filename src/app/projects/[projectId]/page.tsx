"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";
import toast from "react-hot-toast";
import Select from "react-select";
import { Project, Task } from "@/types/types";

export default function ProjectPage() {
  const router = useRouter();
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

    fetchProjectTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProjectTasks = async () => {
    fetch(`/api/projects/${projectId}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);
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
        body: JSON.stringify({
          ...updatedTask,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? prevTask : t)));
        toast.error(errorData.error || "Failed to update task");
        return;
      }

      const savedTask: Task = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...updatedTask,
                ...savedTask,
                parentTasks: prevTask.parentTasks,
                childTasks: prevTask.childTasks,
              }
            : t
        )
      );
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? prevTask : t)));
      toast.error("Network error: failed to update task");
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

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const tempTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      status: "todo",
      projectId: projectId as string,
      dependencies: newTaskDependencies,
      parentTasks: [],
      childTasks: [],
    };
    setTasks((prev) => [...prev, tempTask]);

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          status: "todo",
          dependencies: newTaskDependencies,
          projectId: projectId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const savedTask: Task = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? savedTask : t))
      );

      if (newTaskDependencies.length > 0) {
        setTasks((prev) =>
          prev.map((t) =>
            newTaskDependencies.includes(t.id)
              ? {
                  ...t,
                  childTasks: [
                    ...t.childTasks,
                    { id: savedTask.id, title: savedTask.title },
                  ],
                }
              : t
          )
        );
      }
      setNewTaskTitle("");
      setNewTaskDependencies([]);
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
      toast.error("Failed to add task");
    }
  };

  // TODO: add a spinner loader here
  if (!project) return <div>Loading project...</div>;

  return (
    <div className="p-6 mx-auto flex flex-col gap-8">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
      {project.description && (
        <p className="text-gray-700">{project.description}</p>
      )}

      <TaskBoard
        tasks={tasks}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />

      <div className="w-full flex flex-col gap-8 mt-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Add task to project
        </h2>

        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-task-title"
                className="font-medium text-gray-700"
              >
                Task Title
              </label>
              <input
                id="new-task-title"
                type="text"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full h-9 p-3 rounded-lg border border-gray-700 dark:border-gray-600 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-task-dependencies"
                className="font-medium text-gray-700"
              >
                Depends on
              </label>
              <Select
                isMulti
                options={tasks.map((t) => ({ value: t.id, label: t.title }))}
                value={tasks
                  .filter((t) => newTaskDependencies.includes(t.id))
                  .map((t) => ({ value: t.id, label: t.title }))}
                onChange={(selected) =>
                  setNewTaskDependencies(selected.map((s) => s.value))
                }
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <button
            onClick={handleAddTask}
            className="w-full h-[32px] cursor-pointer font-sans text-sm leading-6 self-start bg-[#0c0c0c] text-white px-6 rounded-md font-medium transition-colors duration-200 hover:bg-[#1a1a1a] active:scale-[0.98]"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
