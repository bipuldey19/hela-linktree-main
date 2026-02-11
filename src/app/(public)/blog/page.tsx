import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { POSTS_PER_PAGE } from "@/lib/constants";
import BlogGrid from "@/components/public/BlogGrid";
import Pagination from "@/components/public/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read our latest posts",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1"));

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        heroImage: true,
        publishedAt: true,
      },
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-400 hover:text-primary mb-8 transition-colors duration-200"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Home
      </Link>
      <div className="mb-10">
        <h1
          className="text-3xl text-stone-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Blog
        </h1>
        <p className="text-sm text-stone-400 mt-2">
          Thoughts, stories, and ideas
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-[15px]">
            No posts published yet. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <BlogGrid posts={posts} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/blog"
          />
        </>
      )}
    </div>
  );
}
