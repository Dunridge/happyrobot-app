"use client";

import { RelTask, Task } from "@/types/types";
import TaskCard from "./TaskCard";

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
  const statuses: ("todo" | "in-progress" | "done")[] = [
    "todo",
    "in-progress",
    "done",
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {statuses.map((status) => (
        <div
          key={status}
          className="flex-1 min-w-[250px] bg-gray-100 dark:bg-gray-700 p-2 rounded"
        >
          <h3 className="font-bold mb-2 text-white capitalize">
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
                  onDeleteTask={onDeleteTask}
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
  );
}
