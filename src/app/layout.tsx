import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: { favicon: true },
  });

  return {
    metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
    icons: settings?.favicon ? { icon: settings.favicon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
