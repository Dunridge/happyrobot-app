"use client";

import { Task } from "@/types/types";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import trashIcon from "@/assets/trash.svg";

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
    <div className="flex flex-col gap-3 p-4 bg-white border border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
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
            className="text-lg text-gray-900 font-semibold cursor-pointer hover:text-blue-500 transition"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </h3>

          <div className="flex gap-2 items-center">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="px-2 py-1 rounded font-medium border border-gray-300 dark:border-gray-600"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace("-", " ")}
                </option>
              ))}
            </select>

            {onDeleteTask && (
              <Image
                onClick={() => onDeleteTask(task.id)}
                className="cursor-pointer"
                width={22}
                height={22}
                src={trashIcon}
                alt="Trash icon"
              />
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 text-sm text-gray-900">
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

      <Link
        href={`/projects/${task.projectId}/tasks/${task.id}`}
        className="w-full h-[32px] cursor-pointer font-sans text-sm font-medium text-white px-6 rounded-md bg-[#0c0c0c] flex items-center justify-center transition-colors duration-200 hover:bg-[#1a1a1a] active:scale-[0.98]"
      >
        Open Task
      </Link>
    </div>
  );
}
