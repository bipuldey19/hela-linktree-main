import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RECENT_POSTS_COUNT } from "@/lib/constants";
import HeroSection from "@/components/public/HeroSection";
import LinkList from "@/components/public/LinkList";
import BlogGrid from "@/components/public/BlogGrid";

export default async function HomePage() {
  const [settings, links, recentPosts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.link.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: RECENT_POSTS_COUNT,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        heroImage: true,
        publishedAt: true,
      },
    }),
  ]);

  return (
    <div>
      <HeroSection
        title={settings?.heroTitle || "Welcome"}
        subtitle={settings?.heroSubtitle || ""}
        description={settings?.siteDescription || ""}
        image={settings?.heroImage || null}
        logo={settings?.siteLogo || null}
      />

      <LinkList
        links={links.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          icon: l.icon,
          logoImage: l.logoImage,
          color: l.color,
        }))}
      />

      {recentPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-5 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-2xl text-stone-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Recent Posts
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Latest from the blog
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary-hover transition-colors duration-200"
            >
              View all
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <BlogGrid posts={recentPosts} />
        </section>
      )}
    </div>
  );
}
