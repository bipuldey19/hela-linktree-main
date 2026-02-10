import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/HeroSection";
import LinkList from "@/components/public/LinkList";
import RecentPostsSection from "@/components/public/RecentPostsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, links] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.link.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div>
      <HeroSection
        title={settings?.heroTitle || "Welcome"}
        subtitle={settings?.heroSubtitle || ""}
        description={settings?.siteDescription || ""}
        image={settings?.heroImage || null}
        logo={settings?.siteLogo || null}
      />

      <LinkList
        links={links.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          icon: l.icon,
          logoImage: l.logoImage,
          color: l.color,
        }))}
      />

      <RecentPostsSection />
    </div>
  );
}
