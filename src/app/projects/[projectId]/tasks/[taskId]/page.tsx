"use client";

import { Task, RelTask } from "@/types/types";
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
      .then((data: Task) => setTask(data))
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
        className="mt-2 inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium shadow"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>

      <div className="mb-4">
        <strong>Status:</strong> {task.status.replace("-", " ")}
      </div>

      {task.parentTasks && task.parentTasks.length > 0 && (
        <div className="mb-4">
          <strong>Parents:</strong>{" "}
          {task.parentTasks.map((p: RelTask) => p.title).join(", ")}
        </div>
      )}

      {task.childTasks && task.childTasks.length > 0 && (
        <div className="mb-4">
          <strong>Children:</strong>{" "}
          {task.childTasks.map((c: RelTask) => c.title).join(", ")}
        </div>
      )}
    </div>
  );
}
