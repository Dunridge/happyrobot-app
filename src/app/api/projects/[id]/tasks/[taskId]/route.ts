import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  projectId: string;
  taskId: string;
}

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { projectId, taskId } = params;

  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId },
  });

  if (!task)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { projectId, taskId } = params;
  const data = await req.json();

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  return NextResponse.json(task);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { projectId, taskId } = params;

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
}
