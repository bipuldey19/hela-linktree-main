"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import slugify from "slugify";

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    heroImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    ogImage: string | null;
    published: boolean;
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    initialData?.metaKeywords || ""
  );
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");
  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing || !initialData?.slug) {
      setSlug(slugify(value, { lower: true, strict: true }));
    }
  }

  async function save(published: boolean) {
    if (!title.trim() || !content.trim()) {
      toast("Title and content are required", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        heroImage: heroImage || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        ogImage: ogImage || null,
        published,
      };

      const url = isEditing ? `/api/posts/${initialData.id}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      toast(
        published
          ? "Post published successfully"
          : "Post saved as draft"
      );
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to save post",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
        />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="post-url-slug"
        />
        <Input
          label="Hero Image URL"
          value={heroImage}
          onChange={(e) => setHeroImage(e.target.value)}
          placeholder="/uploads/blog/image.webp"
        />
        <Textarea
          label="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short description (auto-generated if left blank)"
          rows={2}
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Content (HTML)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div
            className="prose max-w-none border border-gray-200 rounded-lg p-4 min-h-[300px] bg-white"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your HTML content here..."
            rows={16}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[300px]"
          />
        )}
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => setShowSeo(!showSeo)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-gray-900">
            SEO Settings
          </span>
          <span className="text-gray-400">{showSeo ? "▲" : "▼"}</span>
        </button>
        {showSeo && (
          <div className="px-6 pb-6 space-y-4">
            <Input
              label="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO title (defaults to post title)"
              maxLength={70}
            />
            <Textarea
              label="Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO description (defaults to excerpt)"
              maxLength={160}
              rows={2}
            />
            <Input
              label="Keywords"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="comma, separated, keywords"
            />
            <Input
              label="OG Image URL"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="/uploads/blog/og-image.webp (defaults to hero image)"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => save(false)}
          variant="secondary"
          loading={saving}
          size="lg"
        >
          Save as Draft
        </Button>
        <Button onClick={() => save(true)} loading={saving} size="lg">
          {isEditing && initialData?.published ? "Update" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
