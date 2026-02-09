"use client";

import Tabs from "@/components/ui/Tabs";
import SettingsForm from "@/components/admin/SettingsForm";
import ThemeForm from "@/components/admin/ThemeForm";
import LinkManager from "@/components/admin/LinkManager";
import type { ThemeConfig } from "@/types";

interface Props {
  settings: {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    siteLogo: string | null;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string | null;
    metaTitle: string;
    metaDescription: string;
    ogImage: string | null;
    footerText: string;
    favicon: string | null;
  };
  theme: ThemeConfig;
  links: {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    logoImage: string | null;
    color: string | null;
    order: number;
    active: boolean;
  }[];
}

export default function SettingsPageClient({ settings, theme, links }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <Tabs
        tabs={[
          {
            id: "general",
            label: "General",
            content: <SettingsForm initialSettings={settings} />,
          },
          {
            id: "theme",
            label: "Theme",
            content: <ThemeForm initialTheme={theme} />,
          },
          {
            id: "links",
            label: "Links",
            content: <LinkManager initialLinks={links} />,
          },
        ]}
      />
    </div>
  );
}
