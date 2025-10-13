import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}
