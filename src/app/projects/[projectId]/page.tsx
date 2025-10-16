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
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
      >
        ← Back
      </button>

      {/* Project Title & Description */}
      <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
      {project.description && (
        <p className="text-gray-700">{project.description}</p>
      )}

      {/* TODO: update the styles here next  */}
      <TaskBoard
        tasks={tasks}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />

      {/* Add Task Card */}
      <div className="w-full flex justify-center mt-8">
        <div className="p-6 max-w-md w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-6">
          {/* Task Title Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="new-task-title"
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              Task Title
            </label>
            <input
              id="new-task-title"
              type="text"
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-700 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Task Dependencies */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="new-task-dependencies"
              className="font-medium text-gray-700 dark:text-gray-200"
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

          {/* Add Task Button */}
          <button
            onClick={handleAddTask}
            className="w-full h-[40px] bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition transform"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="p-4">
  //     <button
  //       onClick={() => router.back()}
  //       className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
  //     >
  //       ← Back
  //     </button>
  //     <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
  //     {project.description && <p className="mb-4">{project.description}</p>}

  //     <TaskBoard
  //       tasks={tasks}
  //       onUpdateTask={updateTask}
  //       onDeleteTask={deleteTask}
  //     />

  //     <div className="w-full flex justify-center">
  //       <div className="mt-6 p-4 max-w-[500px] min-w-[360px] bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col gap-4">
  //         <div className="flex flex-col">
  //           <label
  //             htmlFor="new-task-title"
  //             className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
  //           >
  //             Task Title
  //           </label>
  //           <input
  //             id="new-task-title"
  //             type="text"
  //             placeholder="Enter task title"
  //             value={newTaskTitle}
  //             onChange={(e) => setNewTaskTitle(e.target.value)}
  //             className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
  //           />
  //         </div>

  //         <div className="flex flex-col">
  //           <label
  //             htmlFor="new-task-dependencies"
  //             className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
  //           >
  //             Depends on
  //           </label>
  //           <Select
  //             isMulti
  //             options={tasks.map((t) => ({ value: t.id, label: t.title }))}
  //             value={tasks
  //               .filter((t) => newTaskDependencies.includes(t.id))
  //               .map((t) => ({ value: t.id, label: t.title }))}
  //             onChange={(selected) =>
  //               setNewTaskDependencies(selected.map((s) => s.value))
  //             }
  //             className="react-select-container"
  //             classNamePrefix="react-select"
  //           />
  //         </div>

  //         <button
  //           onClick={handleAddTask}
  //           className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow self-start"
  //         >
  //           Add Task
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}
