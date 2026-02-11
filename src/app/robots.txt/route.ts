export async function GET() {
  const port = process.env.PORT || 3000;
  const siteUrl = process.env.SITE_URL || `http://localhost:${port}`;

  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
