"use client";

import { Task } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const taskId = params.taskId as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !taskId) return;

    setLoading(true);
    fetch(`/api/projects/${projectId}/tasks/${taskId}`)
      .then((res) => res.json())
      .then(setTask)
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load task");
      })
      .finally(() => setLoading(false));
  }, [projectId, taskId]);

  if (loading) return <div>Loading task...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>

      <div className="mb-4">
        <strong>Status:</strong> {task.status.replace("-", " ")}
      </div>

      {task.dependencies.length > 0 && (
        <div className="mb-4">
          <strong>Depends on:</strong>{" "}
          {task.dependencies.map((depId) => (
            <span key={depId} className="mr-2">
              {depId}
            </span>
          ))}
        </div>
      )}

      {/* {task.comments && task.comments.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-2">Comments</h2>
          <ul>
            {task.comments.map((c: Comment) => (
              <li key={c.id} className="mb-1">
                <strong>{c.author}:</strong> {c.content}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <strong>Created at:</strong>{" "}
        {new Date(task.createdAt!).toLocaleString()}
      </div>
      <div>
        <strong>Updated at:</strong>{" "}
        {new Date(task.updatedAt!).toLocaleString()}
      </div> */}
    </div>
  );
}
