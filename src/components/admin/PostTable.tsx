"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PostTable({ posts: initialPosts }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const router = useRouter();
  const { toast } = useToast();

  async function togglePublish(id: string, currentlyPublished: boolean) {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentlyPublished }),
      });
      if (!res.ok) throw new Error();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, published: !currentlyPublished } : p
        )
      );
      toast(currentlyPublished ? "Post unpublished" : "Post published");
    } catch {
      toast("Failed to update post", "error");
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast("Post deleted");
      router.refresh();
    } catch {
      toast("Failed to delete post", "error");
    }
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center text-gray-500">
        <p className="text-sm">No posts yet.</p>
        <Link
          href="/admin/posts/new"
          className="text-[var(--color-primary)] hover:underline text-sm mt-1 inline-block"
        >
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)]"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-500">/blog/{post.slug}</p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-xs text-gray-600 hover:text-[var(--color-primary)]"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className="text-xs text-gray-600 hover:text-[var(--color-primary)]"
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
