"use client";
import CommentList from "./CommentList";

interface TaskDetailsProps {
  task: { id: string; title: string; description?: string };
  comments: { id: string; author: string; content: string }[];
  onClose: () => void;
}

export default function TaskDetails({
  task,
  comments,
  onClose,
}: TaskDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end">
      <div className="w-full sm:w-1/3 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        <button className="mb-4 text-red-500" onClick={onClose}>
          Close
        </button>
        <h2 className="text-xl font-bold">{task.title}</h2>
        {task.description && <p className="mt-2">{task.description}</p>}
        <CommentList comments={comments} />
      </div>
    </div>
  );
}
