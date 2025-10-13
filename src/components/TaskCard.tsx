"use client";

interface Props {
  task: { id: string; title: string };
}

export default function TaskCard({ task }: Props) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded shadow mb-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900">
      {task.title}
    </div>
  );
}
