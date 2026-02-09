export async function GET() {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
