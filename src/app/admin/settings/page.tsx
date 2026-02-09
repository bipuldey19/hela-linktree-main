import { prisma } from "@/lib/prisma";
import { parseTheme } from "@/lib/theme";
import SettingsPageClient from "./SettingsPageClient";

export default async function SettingsPage() {
  const [settings, links] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.link.findMany({ orderBy: { order: "asc" } }),
  ]);

  const theme = parseTheme(settings?.theme || "{}");

  return (
    <SettingsPageClient
      settings={{
        siteTitle: settings?.siteTitle || "My Site",
        siteDescription: settings?.siteDescription || "",
        siteUrl: settings?.siteUrl || "",
        siteLogo: settings?.siteLogo || null,
        heroTitle: settings?.heroTitle || "Welcome",
        heroSubtitle: settings?.heroSubtitle || "",
        heroImage: settings?.heroImage || null,
        metaTitle: settings?.metaTitle || "",
        metaDescription: settings?.metaDescription || "",
        ogImage: settings?.ogImage || null,
        footerText: settings?.footerText || "",
        favicon: settings?.favicon || null,
      }}
      theme={theme}
      links={links.map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        icon: l.icon,
        logoImage: l.logoImage,
        color: l.color,
        order: l.order,
        active: l.active,
      }))}
    />
  );
}
