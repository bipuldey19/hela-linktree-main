import Link from "next/link";

interface PageLink {
  href: string;
  label: string;
}

export default function Header({
  siteTitle,
  pageLinks = [],
}: {
  siteTitle: string;
  pageLinks?: PageLink[];
}) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-stone-200/60">
      <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-stone-900 tracking-tight text-[15px] hover:text-primary transition-colors duration-200"
        >
          {siteTitle}
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-[13px] font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-all duration-200"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="px-3 py-1.5 text-[13px] font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-all duration-200"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
