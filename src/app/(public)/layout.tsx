import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseTheme, getThemeCssVariables } from "@/lib/theme";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  return settings;
}

async function getActivePages() {
  const pages = await prisma.page.findMany({
    where: { active: true },
    select: { slug: true, title: true },
    orderBy: { createdAt: "asc" },
  });
  return pages;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.metaTitle || settings?.siteTitle || "My Site",
      template: `%s | ${settings?.siteTitle || "My Site"}`,
    },
    description:
      settings?.metaDescription || settings?.siteDescription || "",
    openGraph: {
      siteName: settings?.siteTitle || "My Site",
      images: settings?.ogImage ? [settings.ogImage] : [],
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, pages] = await Promise.all([
    getSiteSettings(),
    getActivePages(),
  ]);
  const theme = parseTheme(settings?.theme || "{}");
  const cssVariables = getThemeCssVariables(theme);

  const pageLinks = pages.map((p) => ({
    href: `/pages/${p.slug}`,
    label: p.title,
  }));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <div
        className="min-h-screen flex flex-col bg-background"
        style={{ fontFamily: theme.fontFamily }}
      >
        <Header
          siteTitle={settings?.siteTitle || "My Site"}
          pageLinks={pageLinks}
        />
        <main className="flex-1">{children}</main>
        <Footer
          text={settings?.footerText || ""}
          pageLinks={pageLinks}
        />
      </div>
    </>
  );
}
