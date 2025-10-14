import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const tasks = await prisma.task.findMany({
    where: { projectId: id },
  });

  return NextResponse.json(tasks);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const { title, status, dependencies } = data;

  if (!title) {
    return NextResponse.json(
      { error: "Task title is required" },
      { status: 400 }
    );
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        status: status ?? "todo",
        projectId: id,
        dependencies: dependencies ?? [],
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
