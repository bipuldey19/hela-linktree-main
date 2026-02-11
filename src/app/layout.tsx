import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: { favicon: true, updatedAt: true },
  });

  const port = process.env.PORT || 3000;
  const baseUrl = process.env.SITE_URL || `http://localhost:${port}`;
  let iconUrl: string;
  if (settings?.favicon) {
    const path = settings.favicon.startsWith("http") ? settings.favicon : `${baseUrl}${settings.favicon.startsWith("/") ? "" : "/"}${settings.favicon}`;
    const v = settings.updatedAt ? new Date(settings.updatedAt).getTime() : Date.now();
    iconUrl = `${path}${path.includes("?") ? "&" : "?"}v=${v}`;
  } else {
    iconUrl = `${baseUrl}/favicon.ico`;
  }

  return {
    metadataBase: new URL(baseUrl),
    icons: { icon: iconUrl },
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
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9M6XLBKYBE"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9M6XLBKYBE');
            `,
          }}
        />
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
