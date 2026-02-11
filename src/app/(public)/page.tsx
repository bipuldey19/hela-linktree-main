import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/HeroSection";
import LinkList from "@/components/public/LinkList";
import MidContentSection from "@/components/public/MidContentSection";
import RecentPostsSection from "@/components/public/RecentPostsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, links, midContent] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.link.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    prisma.midContent.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        image: true,
        headline: true,
        description: true,
        linkButtons: true,
      },
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

      <MidContentSection
        blocks={midContent.map((m) => ({
          id: m.id,
          image: m.image,
          headline: m.headline,
          description: m.description,
          linkButtons: m.linkButtons,
        }))}
      />

      <RecentPostsSection />
    </div>
  );
}
