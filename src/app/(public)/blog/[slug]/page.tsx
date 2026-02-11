import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { generateBlogPostJsonLd } from "@/lib/seo";
import BlogContent from "@/components/public/BlogContent";
import ShareButtons from "@/components/public/ShareButtons";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    return { title: "Not Found" };
  }

  const port = process.env.PORT || 3000;
  const siteUrl = process.env.SITE_URL || `http://localhost:${port}`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    keywords: post.metaKeywords || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      images: (post.ogImage || post.heroImage)
        ? [{ url: (post.ogImage || post.heroImage)!.startsWith("http") ? (post.ogImage || post.heroImage)! : `${siteUrl}${post.ogImage || post.heroImage}` }]
        : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const port = process.env.PORT || 3000;
  const siteUrl = process.env.SITE_URL || `http://localhost:${port}`;
  const jsonLd = generateBlogPostJsonLd(post, siteUrl);

  const readingTime = Math.ceil(
    post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-5 py-12">
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-stone-400 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <span className="text-stone-300">·</span>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to blog
          </Link>
        </nav>

        {post.heroImage && (
          <div className="relative aspect-2/1 rounded-2xl overflow-hidden mb-10 shadow-lg shadow-stone-200/50 animate-fade-in">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              unoptimized={post.heroImage.startsWith("http")}
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <header className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 text-[13px] font-medium text-stone-400 mb-4">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </time>
            )}
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>{readingTime} min read</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl text-stone-900 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>
        </header>

        <div className="animate-fade-in-up stagger-2">
          <BlogContent html={post.content} />
        </div>

        <ShareButtons
          url={`${siteUrl}/blog/${post.slug}`}
          title={post.title}
        />
      </article>
    </>
  );
}
