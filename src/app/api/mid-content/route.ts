import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createMidContentSchema } from "@/lib/validators";

export async function GET() {
  const items = await prisma.midContent.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createMidContentSchema.safeParse({
    ...body,
    linkButtons: body.linkButtons ?? [],
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.midContent.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const item = await prisma.midContent.create({
    data: {
      image: parsed.data.image ?? null,
      headline: parsed.data.headline,
      description: parsed.data.description ?? "",
      linkButtons: JSON.stringify(parsed.data.linkButtons ?? []),
      order: nextOrder,
      active: parsed.data.active ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
