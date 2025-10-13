import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, description, metadata } = data;

  if (!name)
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const project = await prisma.project.create({
    data: { name, description, metadata },
  });

  return NextResponse.json(project);
}
