import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { reorderMidContentSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reorderMidContentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.$transaction(
    parsed.data.orderedIds.map((id, index) =>
      prisma.midContent.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
