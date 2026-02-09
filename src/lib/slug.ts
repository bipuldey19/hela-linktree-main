import slugify from "slugify";
import { prisma } from "./prisma";

export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export async function ensureUniqueSlug(
  slug: string,
  excludeId?: string
): Promise<string> {
  let candidate = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${slug}-${counter}`;
    counter++;
  }
}
