import { prisma } from "@/lib/prisma";
import PageEditor from "@/components/admin/PageEditor";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pages</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage your site pages. Edit the content for About, Contact, Privacy Policy, and Terms & Conditions.
      </p>
      <PageEditor
        initialPages={pages.map((p) => ({
          slug: p.slug,
          title: p.title,
          content: p.content,
          active: p.active,
        }))}
      />
    </div>
  );
}
