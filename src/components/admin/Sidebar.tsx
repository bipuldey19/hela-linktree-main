"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/posts", label: "Posts", icon: "📝" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/media", label: "Media", icon: "🖼️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  { href: "/admin/users", label: "Users", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900">Admin</span>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            🚪
          </button>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <Link href="/admin" className="font-bold text-lg text-gray-900">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors"
          >
            <span>🌐</span>
            <span>View Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
