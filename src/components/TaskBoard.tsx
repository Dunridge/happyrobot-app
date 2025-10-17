"use client";

import { RelTask, Task } from "@/types/types";
import TaskCard from "./TaskCard";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

type Props = {
  tasks: Task[];
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
};

export default function TaskBoard({
  tasks,
  onUpdateTask,
  onDeleteTask,
}: Props) {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTaskId && onDeleteTask) {
      onDeleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTaskId(null);
  };

  const statuses: ("todo" | "in-progress" | "done")[] = [
    "todo",
    "in-progress",
    "done",
  ];

  return (
    <>
      <ConfirmModal
        isOpen={!!deleteTaskId}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <div className="flex gap-4 p-4 overflow-x-auto">
        {statuses.map((status) => (
          <div
            key={status}
            className="flex-1 min-w-[250px] bg-gray-100 border border-gray-700 p-2 rounded"
          >
            <h3 className="font-bold mb-2 text-gray-800 capitalize">
              {status.replace("-", " ")}
            </h3>
            <div className="flex flex-col gap-2">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={() => setDeleteTaskId(task.id)}
                    childrenTaskNames={task?.childTasks?.map(
                      (task: RelTask) => task.title
                    )}
                    parentTaskNames={task?.parentTasks?.map(
                      (task: RelTask) => task.title
                    )}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
