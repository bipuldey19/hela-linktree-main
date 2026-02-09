import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { createPostSchema } from "@/lib/validators";
import { sanitizeHtml } from "@/lib/sanitize";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const publishedOnly = searchParams.get("published") === "true";

  const where = publishedOnly ? { published: true } : {};

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, content, published, ...rest } = parsed.data;

  const slug = await ensureUniqueSlug(generateSlug(title));
  const sanitizedContent = sanitizeHtml(content);

  const excerpt =
    rest.excerpt ||
    sanitizedContent
      .replace(/<[^>]*>/g, "")
      .substring(0, 160)
      .trim();

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content: sanitizedContent,
      excerpt,
      published,
      publishedAt: published ? new Date() : null,
      heroImage: rest.heroImage,
      metaTitle: rest.metaTitle,
      metaDescription: rest.metaDescription,
      metaKeywords: rest.metaKeywords,
      ogImage: rest.ogImage,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
