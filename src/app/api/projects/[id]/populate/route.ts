import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const numTasks = 1000;
  const tasks = Array.from({ length: numTasks }, (_, i) => ({
    title: `Task ${i + 1}`,
    status: "todo",
    projectId,
    assignedTo: [],
    configuration: { priority: "medium", description: "", tags: [] },
    dependencies: [],
  }));

  try {
    const batchSize = 200;
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      await prisma.task.createMany({ data: batch });
    }

    return NextResponse.json({
      success: true,
      message: `${numTasks} tasks created`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to populate tasks" },
      { status: 500 }
    );
  }
}
