import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostTable from "@/components/admin/PostTable";

export default async function PostsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          New Post
        </Link>
      </div>
      <PostTable
        posts={posts.map((p) => ({
          ...p,
          publishedAt: p.publishedAt?.toISOString() || null,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
