"use client";

import { Task, RelTask } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTaskWebSocket } from "@/hooks/useTaskWebSocket";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const taskId = params.taskId as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentPayload = {
      taskId: task!.id,
      content: newComment,
      author: "Anonymous",
    };

    try {
      await fetch(`/api/projects/${projectId}/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentPayload),
      });

      setNewComment("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWSMessage = useCallback((msg: any) => {
    switch (msg.type) {
      case "new-comment":
        setTask((prev) =>
          prev
            ? {
                ...prev,
                comments: [...(prev.comments || []), msg.payload.comment],
              }
            : prev
        );
        break;

      case "task-updated":
        setTask((prev) => (prev ? { ...prev, ...msg.payload } : prev));
        break;
    }
  }, []);

  useTaskWebSocket(taskId, handleWSMessage);

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

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      <div className="mt-6">
        <h2 className="font-bold mb-2">Comments</h2>
        <ul>
          {task.comments?.map((c) => (
            <li key={c.id} className="mb-1">
              <strong>{c.author}:</strong> {c.content}{" "}
              <span className="text-gray-400 text-sm">
                ({new Date(c.createdAt).toLocaleTimeString()})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
