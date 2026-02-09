import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { updatePostSchema } from "@/lib/validators";
import { sanitizeHtml } from "@/lib/sanitize";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

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
  const parsed = updatePostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};

  if (parsed.data.title !== undefined) {
    data.title = parsed.data.title;
    if (parsed.data.slug) {
      data.slug = await ensureUniqueSlug(
        generateSlug(parsed.data.slug),
        id
      );
    } else {
      data.slug = await ensureUniqueSlug(
        generateSlug(parsed.data.title),
        id
      );
    }
  }

  if (parsed.data.content !== undefined) {
    data.content = sanitizeHtml(parsed.data.content);
    if (!parsed.data.excerpt) {
      data.excerpt = (data.content as string)
        .replace(/<[^>]*>/g, "")
        .substring(0, 160)
        .trim();
    }
  }

  if (parsed.data.published !== undefined) {
    data.published = parsed.data.published;
    if (parsed.data.published && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  if (parsed.data.excerpt !== undefined) data.excerpt = parsed.data.excerpt;
  if (parsed.data.heroImage !== undefined)
    data.heroImage = parsed.data.heroImage;
  if (parsed.data.metaTitle !== undefined)
    data.metaTitle = parsed.data.metaTitle;
  if (parsed.data.metaDescription !== undefined)
    data.metaDescription = parsed.data.metaDescription;
  if (parsed.data.metaKeywords !== undefined)
    data.metaKeywords = parsed.data.metaKeywords;
  if (parsed.data.ogImage !== undefined) data.ogImage = parsed.data.ogImage;

  const post = await prisma.blogPost.update({ where: { id }, data });

  return NextResponse.json(post);
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
  await prisma.blogPost.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
