"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";

interface Settings {
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
}

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Settings;
}) {
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function update(field: keyof Settings, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast("Settings saved successfully");
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Site Info</h3>
        <div className="space-y-4">
          <Input
            label="Site Title"
            value={form.siteTitle}
            onChange={(e) => update("siteTitle", e.target.value)}
          />
          <Input
            label="Site URL"
            value={form.siteUrl}
            onChange={(e) => update("siteUrl", e.target.value)}
            placeholder="https://your-domain.com"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Site Logo</h3>
        <p className="text-sm text-gray-500 mb-3">
          Circular logo displayed in the hero section. Recommended: square image, at least 200x200px.
        </p>
        <ImageUploader
          value={form.siteLogo || ""}
          onChange={(url) => update("siteLogo", url)}
          category="site"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Hero Section</h3>
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.heroTitle}
            onChange={(e) => update("heroTitle", e.target.value)}
            placeholder="Your main heading"
          />
          <Input
            label="Tagline"
            value={form.heroSubtitle}
            onChange={(e) => update("heroSubtitle", e.target.value)}
            placeholder="A short tagline shown under the title"
          />
          <Textarea
            label="Site Description"
            value={form.siteDescription}
            onChange={(e) => update("siteDescription", e.target.value)}
            placeholder="Displayed in a card below the hero title and tagline"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Background Image
            </label>
            <ImageUploader
              value={form.heroImage || ""}
              onChange={(url) => update("heroImage", url)}
              category="site"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">SEO Defaults</h3>
        <div className="space-y-4">
          <Input
            label="Meta Title"
            value={form.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            maxLength={70}
          />
          <Textarea
            label="Meta Description"
            value={form.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            maxLength={160}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OG Image
            </label>
            <ImageUploader
              value={form.ogImage || ""}
              onChange={(url) => update("ogImage", url)}
              category="site"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Favicon</h3>
        <p className="text-sm text-gray-500 mb-3">
          Browser tab icon. Recommended: square image, 32x32px or 64x64px. PNG or ICO format works best.
        </p>
        <ImageUploader
          value={form.favicon || ""}
          onChange={(url) => update("favicon", url)}
          category="site"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Footer</h3>
        <Input
          label="Footer Text"
          value={form.footerText}
          onChange={(e) => update("footerText", e.target.value)}
        />
      </div>

      <Button onClick={handleSave} loading={saving} size="lg">
        Save Settings
      </Button>
    </div>
  );
}
