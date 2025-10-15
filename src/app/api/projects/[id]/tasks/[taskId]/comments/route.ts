import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  const resolvedParams = await params;
  const { taskId } = resolvedParams;
  const { author, content } = await req.json();

  const comment = await prisma.comment.create({
    data: { taskId, author, content },
  });

  fetch("http://localhost:3001/broadcast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId,
      data: { type: "new-comment", payload: { taskId, comment } },
    }),
  }).catch((err) => console.error("Broadcast error:", err));

  return NextResponse.json(comment);
}
