import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;

  const tasks = await prisma.task.findMany({
    where: { projectId: id },
    include: {
      comments: true,
    },
  });

  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const tasksWithRelations = tasks.map((t) => {
    const parents = t.dependencies
      .map((depId) => taskMap.get(depId))
      .filter(Boolean)
      .map((p) => ({ id: p!.id, title: p!.title }));

    const children = tasks
      .filter((other) => other.dependencies.includes(t.id))
      .map((child) => ({ id: child.id, title: child.title }));

    return {
      ...t,
      parentTasks: parents,
      childTasks: children,
    };
  });
  const taskWithRelations = tasksWithRelations.find((t) => t.id === taskId);

  if (!taskWithRelations) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(taskWithRelations);
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
