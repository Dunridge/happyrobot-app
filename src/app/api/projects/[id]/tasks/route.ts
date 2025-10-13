import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = params;

  const tasks = await prisma.task.findMany({
    where: { projectId: id },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const data = await req.json();
  const { title, description, metadata } = data;

  if (!title) {
    return NextResponse.json(
      { error: "Task title is required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      metadata,
      projectId: id,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
