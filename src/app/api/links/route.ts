import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { createLinkSchema } from "@/lib/validators";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createLinkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.link.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const link = await prisma.link.create({
    data: { ...parsed.data, order: nextOrder },
  });

  return NextResponse.json(link, { status: 201 });
}
