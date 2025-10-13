"use client";

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      {comments.map((c) => (
        <div
          key={c.id}
          className="p-2 mb-1 bg-gray-100 dark:bg-gray-700 rounded"
        >
          <strong>{c.author}</strong>: {c.content}
        </div>
      ))}
    </div>
  );
}
