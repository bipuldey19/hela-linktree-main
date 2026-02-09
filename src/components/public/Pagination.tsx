import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`w-9 h-9 flex items-center justify-center text-[13px] font-medium rounded-lg transition-all duration-200 ${
            page === currentPage
              ? "bg-primary text-white shadow-sm"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
        >
          Next
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
