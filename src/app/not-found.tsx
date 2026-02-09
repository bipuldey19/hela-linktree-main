import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
