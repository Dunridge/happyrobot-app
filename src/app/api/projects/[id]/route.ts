import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  return project
    ? NextResponse.json(project)
    : NextResponse.json({ error: "Project not found" }, { status: 404 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Task table has a foreign key projectId pointing to Project
    await prisma.comment.deleteMany({
      where: {
        task: {
          projectId: id,
        },
      },
    });
    await prisma.task.deleteMany({ where: { projectId: id } });

    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Project not found or could not be deleted" },
      { status: 404 }
    );
  }
}
