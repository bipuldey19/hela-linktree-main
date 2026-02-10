"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogGrid from "./BlogGrid";

const RECENT_COUNT = 6;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  publishedAt: string | null;
};

export default function RecentPostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts?published=true&limit=${RECENT_COUNT}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className="text-2xl text-stone-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Posts
          </h2>
          <p className="text-sm text-stone-400 mt-1">Latest from the blog</p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary-hover transition-colors duration-200"
        >
          View all
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      {loading ? (
        <p className="text-stone-400 text-sm text-center py-8">Loading…</p>
      ) : posts.length > 0 ? (
        <BlogGrid
          posts={posts.map((p) => ({
            ...p,
            publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
          }))}
        />
      ) : (
        <p className="text-stone-400 text-sm text-center py-8">
          No posts yet.{" "}
          <Link href="/blog" className="text-primary hover:underline">
            View blog
          </Link>
        </p>
      )}
    </section>
  );
}
