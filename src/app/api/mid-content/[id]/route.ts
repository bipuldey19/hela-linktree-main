import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateMidContentSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateMidContentSchema.safeParse({
    ...body,
    linkButtons: body.linkButtons !== undefined ? body.linkButtons : undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.midContent.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.headline !== undefined) data.headline = parsed.data.headline;
  if (parsed.data.description !== undefined)
    data.description = parsed.data.description;
  if (parsed.data.image !== undefined) data.image = parsed.data.image;
  if (parsed.data.active !== undefined) data.active = parsed.data.active;
  if (parsed.data.linkButtons !== undefined)
    data.linkButtons = JSON.stringify(parsed.data.linkButtons);

  const item = await prisma.midContent.update({
    where: { id },
    data,
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.midContent.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
