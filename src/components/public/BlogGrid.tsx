import BlogCard from "./BlogCard";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  publishedAt: Date | null;
}

export default function BlogGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <BlogCard
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            heroImage={post.heroImage}
            publishedAt={post.publishedAt}
          />
        </div>
      ))}
    </div>
  );
}
