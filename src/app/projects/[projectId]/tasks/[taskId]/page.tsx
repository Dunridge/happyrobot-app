"use client";

import { Task, RelTask } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTaskWebSocket } from "@/hooks/useTaskWebSocket";

// TODO: figure out how to add the author of the comment if we don't have logins for users
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
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-extrabold mb-4">{task.title}</h1>

      <div className="mb-4">
        <span className="font-semibold">Status:</span>{" "}
        <span className="text-gray-700">{task.status.replace("-", " ")}</span>
      </div>

      {task.parentTasks?.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Parents:</span>{" "}
          <span className="text-gray-700">
            {task.parentTasks.map((p: RelTask) => p.title).join(", ")}
          </span>
        </div>
      )}

      {task.childTasks?.length > 0 && (
        <div className="mb-6">
          <span className="font-semibold">Children:</span>{" "}
          <span className="text-gray-700">
            {task.childTasks.map((c: RelTask) => c.title).join(", ")}
          </span>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddComment}
          className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition font-medium"
        >
          Send
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Comments</h2>
        {task.comments?.length ? (
          <ul className="space-y-3">
            {task.comments.map((c) => (
              <li
                key={c.id}
                className="p-3 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-gray-800">{c.author}</strong>
                  <span className="text-gray-400 text-sm">
                    {new Date(c?.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{c.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
