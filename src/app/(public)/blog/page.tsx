import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { POSTS_PER_PAGE } from "@/lib/constants";
import BlogGrid from "@/components/public/BlogGrid";
import Pagination from "@/components/public/Pagination";

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
