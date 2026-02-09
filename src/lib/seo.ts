interface BlogPostSeo {
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}

export function generateBlogPostJsonLd(post: BlogPostSeo, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.heroImage ? `${siteUrl}${post.heroImage}` : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    description: post.metaDescription || post.excerpt || "",
    url: `${siteUrl}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };
}
