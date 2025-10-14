"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
}

interface Props {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdateTask, onDeleteTask }: Props) {
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
    <div className="p-3 bg-white dark:bg-gray-800 text-white rounded shadow mb-2">
      {isEditing ? (
        <div className="flex gap-2 items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 flex-1 rounded"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="cursor-pointer" onClick={() => setIsEditing(true)}>
            {task.title}
          </span>
          <div className="flex gap-2 items-center">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="border rounded p-1 bg-white dark:bg-gray-700"
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
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
