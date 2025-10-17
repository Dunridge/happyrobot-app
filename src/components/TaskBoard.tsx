"use client";

import { Task } from "@/types/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import TaskCard from "./TaskCard";

type Props = {
  tasks: Task[];
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
};

function TaskColumn({
  tasks,
  status,
  onUpdateTask,
  // onDeleteTask,
  setDeleteTaskId,
}: {
  tasks: Task[];
  status: "todo" | "in-progress" | "done";
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  setDeleteTaskId: (id: string) => void;
}) {
  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.status === status),
    [tasks, status]
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // initial guess
    overscan: 5,
    // measureElement: (el) => el.getBoundingClientRect().height, // dynamically measure height
  });

  return (
    <div className="flex-1 min-w-[250px] bg-gray-100 border border-gray-700 p-2 rounded">
      <h3 className="font-bold mb-2 text-gray-800 capitalize">
        {status.replace("-", " ")}
      </h3>

      <div ref={parentRef} className="h-[800px] overflow-auto relative">
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const task = filteredTasks[virtualRow.index];
            return (
              <div
                key={task.id}
                ref={(el) => {
                  if (el) rowVirtualizer.measureElement(el);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <TaskCard
                  task={task}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={() => setDeleteTaskId(task.id)}
                  childrenTaskNames={task.childTasks?.map((t) => t.title)}
                  parentTaskNames={task.parentTasks?.map((t) => t.title)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  const handleCancelDelete = () => setDeleteTaskId(null);

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
          <TaskColumn
            key={status}
            tasks={tasks}
            status={status}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            setDeleteTaskId={setDeleteTaskId}
          />
        ))}
      </div>
    </>
  );
}
