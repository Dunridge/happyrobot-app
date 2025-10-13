import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;

  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId: id },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;
  const data = await req.json();

  const task = await prisma.task.update({
    where: { id: taskId, projectId: id },
    data,
  });

  return NextResponse.json(task);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;

  try {
    await prisma.task.delete({
      where: { id: taskId, projectId: id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
}
