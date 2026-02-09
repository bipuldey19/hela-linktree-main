"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import type { ThemeConfig } from "@/types";
import { DEFAULT_THEME } from "@/lib/theme";

const FONT_OPTIONS = [
  "Inter, system-ui, sans-serif",
  "Georgia, serif",
  "Menlo, monospace",
  "system-ui, sans-serif",
  "'Segoe UI', sans-serif",
];

const BUTTON_STYLES = ["filled", "outline", "ghost"] as const;
const BG_STYLES = ["white", "light", "gradient"] as const;

export default function ThemeForm({
  initialTheme,
}: {
  initialTheme: ThemeConfig;
}) {
  const [theme, setTheme] = useState<ThemeConfig>({
    ...DEFAULT_THEME,
    ...initialTheme,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function update<K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: JSON.stringify(theme) }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast("Theme saved successfully");
    } catch {
      toast("Failed to save theme", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Colors</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={theme.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="max-w-[140px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Hover Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColorHover}
                onChange={(e) => update("primaryColorHover", e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={theme.primaryColorHover}
                onChange={(e) => update("primaryColorHover", e.target.value)}
                className="max-w-[140px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Typography</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => update("fontFamily", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font} value={font}>
                {font.split(",")[0].replace(/'/g, "")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="24"
                value={parseInt(theme.borderRadius)}
                onChange={(e) => update("borderRadius", `${e.target.value}px`)}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12">
                {theme.borderRadius}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Style
            </label>
            <div className="flex gap-2">
              {BUTTON_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => update("buttonStyle", style)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors capitalize ${
                    theme.buttonStyle === style
                      ? "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Style
            </label>
            <div className="flex gap-2">
              {BG_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => update("bgStyle", style)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors capitalize ${
                    theme.bgStyle === style
                      ? "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {theme.bgStyle === "gradient" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gradient From
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bgGradientFrom || "#EFF6FF"}
                    onChange={(e) => update("bgGradientFrom", e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={theme.bgGradientFrom || "#EFF6FF"}
                    onChange={(e) => update("bgGradientFrom", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gradient To
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bgGradientTo || "#F5F3FF"}
                    onChange={(e) => update("bgGradientTo", e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={theme.bgGradientTo || "#F5F3FF"}
                    onChange={(e) => update("bgGradientTo", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
        <div
          className="p-6 rounded-lg"
          style={{
            background:
              theme.bgStyle === "gradient"
                ? `linear-gradient(135deg, ${theme.bgGradientFrom || "#EFF6FF"}, ${theme.bgGradientTo || "#F5F3FF"})`
                : theme.bgStyle === "light"
                  ? "#F9FAFB"
                  : "#FFFFFF",
            fontFamily: theme.fontFamily,
          }}
        >
          <h2 className="text-lg font-bold mb-2">Sample Heading</h2>
          <p className="text-sm text-gray-600 mb-4">
            This is a preview of your theme settings.
          </p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-white"
              style={{
                backgroundColor: theme.primaryColor,
                borderRadius: theme.borderRadius,
              }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 text-sm font-medium border-2"
              style={{
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                borderRadius: theme.borderRadius,
              }}
            >
              Outline Button
            </button>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} size="lg">
        Save Theme
      </Button>
    </div>
  );
}
