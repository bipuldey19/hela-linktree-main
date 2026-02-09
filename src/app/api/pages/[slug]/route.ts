import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { updatePageSchema } from "@/lib/validators";
import { sanitizeHtml } from "@/lib/sanitize";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json();
  const parsed = updatePageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const sanitizedContent = sanitizeHtml(parsed.data.content);

  const page = await prisma.page.upsert({
    where: { slug },
    update: {
      title: parsed.data.title,
      content: sanitizedContent,
      active: parsed.data.active,
    },
    create: {
      slug,
      title: parsed.data.title,
      content: sanitizedContent,
      active: parsed.data.active ?? true,
    },
  });

  return NextResponse.json(page);
}
