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

  console.log("Incoming data:", data);

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (data.status === "done" && existingTask.dependencies.length > 0) {
    const dependencyTasks = await prisma.task.findMany({
      where: { id: { in: existingTask.dependencies } },
      select: { id: true, status: true },
    });

    const incompleteDeps = dependencyTasks.filter((t) => t.status !== "done");

    if (incompleteDeps.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot mark task as done. All dependency tasks must be in 'done' state first.",
          incompleteDependencies: incompleteDeps.map((t) => t.id),
        },
        { status: 400 }
      );
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title ?? existingTask.title,
      status: data.status ?? existingTask.status,
      dependencies: data.dependencies ?? existingTask.dependencies,
      projectId: id,
    },
  });

  return NextResponse.json(updatedTask);
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
