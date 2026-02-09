import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  publishedAt: Date | null;
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  heroImage,
  publishedAt,
}: BlogCardProps) {
  const isExternal = heroImage?.startsWith("http");

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:border-stone-300/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      {heroImage && (
        <div className="aspect-[16/9] relative bg-stone-100 overflow-hidden">
          <Image
            src={heroImage}
            alt={title}
            fill
            unoptimized={isExternal}
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        {publishedAt && (
          <p className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </p>
        )}
        <h3
          className="font-semibold text-stone-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "1.125rem" }}
        >
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-stone-500 mt-2 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
