"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:pl-60 pt-14 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
