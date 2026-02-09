import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogContent from "@/components/public/BlogContent";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page || !page.active) {
    return { title: "Not Found" };
  }

  return {
    title: page.title,
    description: page.title,
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page || !page.active) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-5 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-400 hover:text-primary mb-8 transition-colors duration-200 animate-fade-in-up"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </Link>

      <header className="mb-10 animate-fade-in-up">
        <h1
          className="text-3xl sm:text-4xl text-stone-900 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {page.title}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-primary/30" />
      </header>

      <div className="animate-fade-in-up stagger-2">
        <BlogContent html={page.content} />
      </div>
    </article>
  );
}
