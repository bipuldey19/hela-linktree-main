import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [publishedCount, draftCount, linkCount, recentPosts] =
    await Promise.all([
      prisma.blogPost.count({ where: { published: true } }),
      prisma.blogPost.count({ where: { published: false } }),
      prisma.link.count(),
      prisma.blogPost.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, published: true, updatedAt: true },
      }),
    ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Published Posts</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{draftCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Links</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{linkCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Posts</h2>
        </div>
        {recentPosts.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            No posts yet.{" "}
            <Link
              href="/admin/posts/new"
              className="text-[var(--color-primary)] hover:underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
