"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { useToast } from "@/components/ui/Toast";

interface PageData {
  slug: string;
  title: string;
  content: string;
  active: boolean;
}

export default function PageEditor({
  initialPages,
}: {
  initialPages: PageData[];
}) {
  const [pages, setPages] = useState(initialPages);
  const [activeSlug, setActiveSlug] = useState(initialPages[0]?.slug || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const activePage = pages.find((p) => p.slug === activeSlug);

  function updatePage(slug: string, field: keyof PageData, value: string | boolean) {
    setPages((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  }

  async function handleSave(slug: string) {
    const page = pages.find((p) => p.slug === slug);
    if (!page) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          content: page.content,
          active: page.active,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast("Page saved successfully");
    } catch {
      toast("Failed to save page", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Page tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pages.map((page) => (
          <button
            key={page.slug}
            onClick={() => setActiveSlug(page.slug)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSlug === page.slug
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page.title}
          </button>
        ))}
      </div>

      {/* Active page editor */}
      {activePage && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                Edit: {activePage.title}
              </h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={activePage.active}
                  onChange={(e) =>
                    updatePage(activePage.slug, "active", e.target.checked)
                  }
                  className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-gray-600">Visible on site</span>
              </label>
            </div>

            <div className="space-y-4">
              <Input
                label="Page Title"
                value={activePage.title}
                onChange={(e) =>
                  updatePage(activePage.slug, "title", e.target.value)
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page URL
                </label>
                <div className="text-sm text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  /pages/{activePage.slug}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <TiptapEditor
                  key={activePage.slug}
                  content={activePage.content}
                  onChange={(html) =>
                    updatePage(activePage.slug, "content", html)
                  }
                />
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleSave(activePage.slug)}
            loading={saving}
            size="lg"
          >
            Save Page
          </Button>
        </div>
      )}
    </div>
  );
}
