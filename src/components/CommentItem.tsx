"use client";

interface CommentItemProps {
  author: string;
  content: string;
  timestamp?: string;
}

export default function CommentItem({
  author,
  content,
  timestamp,
}: CommentItemProps) {
  const date = timestamp ? new Date(timestamp).toLocaleString() : null;

  return (
    <div className="p-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded">
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
        <span className="font-semibold">{author}</span>
        {date && <span className="text-xs">{date}</span>}
      </div>
      <p className="text-gray-800 dark:text-gray-100">{content}</p>
    </div>
  );
}
