import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </SessionProvider>
  );
}
