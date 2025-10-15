"use client";

import { Task } from "@/types/types";
import { useState } from "react";
import Link from "next/link";

type Props = {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  childrenTaskNames: string[];
  parentTaskNames: string[];
};

export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
  childrenTaskNames,
  parentTaskNames,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const statuses: Task["status"][] = ["todo", "in-progress", "done"];

  const statusColors: Record<Task["status"], string> = {
    todo: "bg-gray-200 text-gray-800",
    "in-progress": "bg-yellow-200 text-yellow-800",
    done: "bg-green-200 text-green-800",
  };

  const handleSave = () => {
    if (onUpdateTask && title.trim() !== task.title) {
      onUpdateTask(task.id, { title });
    }
    setIsEditing(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { status: e.target.value as Task["status"] });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      {isEditing ? (
        <div className="flex gap-2 items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h3
            className="text-lg text-white font-semibold cursor-pointer hover:text-blue-500 transition"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </h3>

          <div className="flex gap-2 items-center">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className={`px-2 py-1 rounded font-medium ${
                statusColors[task.status]
              } border border-gray-300 dark:border-gray-600`}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace("-", " ")}
                </option>
              ))}
            </select>

            {onDeleteTask && (
              <button
                onClick={() => onDeleteTask(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Dependencies */}
      <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
        {!!childrenTaskNames && childrenTaskNames?.length > 0 && (
          <div>
            <strong>Children:</strong> {childrenTaskNames.join(", ")}
          </div>
        )}
        {!!parentTaskNames && parentTaskNames?.length > 0 && (
          <div>
            <strong>Parents:</strong> {parentTaskNames.join(", ")}
          </div>
        )}
      </div>

      {/* Open Task Link */}
      <Link
        href={`/projects/${task.projectId}/tasks/${task.id}`}
        className="mt-2 inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium shadow"
      >
        Open Task
      </Link>
    </div>
  );
}
