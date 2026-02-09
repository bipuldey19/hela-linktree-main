import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: { siteUrl: true },
  });

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const baseUrl = settings?.siteUrl || process.env.SITE_URL || "http://localhost:3000";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${posts
  .map(
    (p) => `  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
