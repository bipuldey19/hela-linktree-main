import Link from "next/link";

interface PageLink {
  href: string;
  label: string;
}

export default function Footer({
  text,
  pageLinks = [],
}: {
  text: string;
  pageLinks?: PageLink[];
}) {
  return (
    <footer className="w-full mt-20">
      <div className="border-t border-stone-200/60">
        <div className="max-w-4xl mx-auto px-5 py-8">
          {pageLinks.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-5">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-stone-400 hover:text-stone-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {text && (
            <p className="text-[13px] text-stone-400 leading-relaxed text-center">
              {text}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
