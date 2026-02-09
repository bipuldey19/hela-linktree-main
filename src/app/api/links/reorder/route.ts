import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { reorderLinksSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reorderLinksSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updates = parsed.data.orderedIds.map((id, index) =>
    prisma.link.update({ where: { id }, data: { order: index } })
  );

  await prisma.$transaction(updates);

  const links = await prisma.link.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(links);
}
