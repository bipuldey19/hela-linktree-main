"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  logoImage: string | null;
  color: string | null;
  order: number;
  active: boolean;
}

const DEFAULT_COLORS = [
  "#0e7490",
  "#6d28d9",
  "#7c3aed",
  "#78716c",
  "#9f1239",
  "#65a30d",
  "#c2410c",
  "#1d4ed8",
];

export default function LinkManager({
  initialLinks,
}: {
  initialLinks: LinkItem[];
}) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_COLORS[0]);
  const [newLogoImage, setNewLogoImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const newLogoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function uploadLogo(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "site");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch {
      toast("Failed to upload logo", "error");
      return null;
    }
  }

  async function handleNewLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo("new");
    const url = await uploadLogo(file);
    if (url) setNewLogoImage(url);
    setUploadingLogo(null);
    e.target.value = "";
  }

  async function handleExistingLogoUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    linkId: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(linkId);
    const url = await uploadLogo(file);
    if (url) {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoImage: url }),
      });
      if (res.ok) {
        setLinks((prev) =>
          prev.map((l) => (l.id === linkId ? { ...l, logoImage: url } : l))
        );
      }
    }
    setUploadingLogo(null);
    e.target.value = "";
  }

  async function addLink() {
    if (!newTitle || !newUrl) return;
    setSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          url: newUrl,
          icon: newIcon || null,
          logoImage: newLogoImage || null,
          color: newColor || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const link = await res.json();
      setLinks((prev) => [...prev, link]);
      setNewTitle("");
      setNewUrl("");
      setNewIcon("");
      setNewLogoImage("");
      setNewColor(DEFAULT_COLORS[links.length % DEFAULT_COLORS.length]);
      toast("Link added");
    } catch {
      toast("Failed to add link", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLink(id: string) {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast("Link deleted");
    } catch {
      toast("Failed to delete link", "error");
    }
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, active: !active } : l))
      );
    } catch {
      toast("Failed to update link", "error");
    }
  }

  async function updateColor(id: string, color: string) {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, color } : l))
      );
    } catch {
      toast("Failed to update color", "error");
    }
  }

  async function moveLink(index: number, direction: "up" | "down") {
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;

    [newLinks[index], newLinks[swapIndex]] = [
      newLinks[swapIndex],
      newLinks[index],
    ];
    setLinks(newLinks);

    try {
      await fetch("/api/links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newLinks.map((l) => l.id) }),
      });
    } catch {
      toast("Failed to reorder", "error");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add new link */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Add New Link</h3>
        <div className="space-y-3">
          <Input
            placeholder="Link title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            placeholder="https://example.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            type="url"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Icon (emoji, optional)"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Color:</label>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-400">{newColor}</span>
            </div>
          </div>

          {/* Logo upload for new link */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Logo image (optional)
            </label>
            {newLogoImage ? (
              <div className="flex items-center gap-3">
                <Image
                  src={newLogoImage}
                  alt="Logo"
                  width={48}
                  height={48}
                  unoptimized={newLogoImage.startsWith("http")}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNewLogoImage("")}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => newLogoInputRef.current?.click()}
                className="text-sm text-blue-600 hover:text-blue-800 border border-dashed border-gray-300 rounded-lg px-4 py-2"
              >
                {uploadingLogo === "new" ? "Uploading..." : "Upload logo"}
              </button>
            )}
            <input
              ref={newLogoInputRef}
              type="file"
              accept="image/*"
              onChange={handleNewLogoUpload}
              className="hidden"
            />
          </div>

          <Button onClick={addLink} loading={saving} size="sm">
            Add Link
          </Button>
        </div>
      </div>

      {/* Link list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Links ({links.length})
          </h3>
        </div>
        {links.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            No links yet. Add your first link above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {links.map((link, index) => (
              <li key={link.id} className="px-5 py-3 space-y-2">
                <div className="flex items-center gap-3">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveLink(index, "up")}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveLink(index, "down")}
                      disabled={index === links.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Logo preview */}
                  {link.logoImage ? (
                    <Image
                      src={link.logoImage}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized={link.logoImage.startsWith("http")}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: link.color || "#3B82F6" }}
                    >
                      {link.icon || link.title.charAt(0)}
                    </div>
                  )}

                  {/* Link info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {link.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => toggleActive(link.id, link.active)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      link.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {link.active ? "Active" : "Hidden"}
                  </button>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* Color & logo controls */}
                <div className="flex items-center gap-4 ml-10">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-500">Color:</label>
                    <input
                      type="color"
                      value={link.color || "#3B82F6"}
                      onChange={(e) => updateColor(link.id, e.target.value)}
                      className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logoInputRef.current?.setAttribute("data-link-id", link.id);
                      logoInputRef.current?.click();
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {uploadingLogo === link.id
                      ? "Uploading..."
                      : link.logoImage
                        ? "Change logo"
                        : "Add logo"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hidden file input for existing link logo uploads */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const linkId = logoInputRef.current?.getAttribute("data-link-id");
          if (linkId) handleExistingLogoUpload(e, linkId);
        }}
        className="hidden"
      />
    </div>
  );
}
