"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";

export type LinkButton = { label: string; url: string };

export interface MidContentItem {
  id: string;
  image: string | null;
  headline: string;
  description: string;
  linkButtons: string;
  order: number;
  active: boolean;
}

function parseButtons(json: string): LinkButton[] {
  try {
    const arr = JSON.parse(json || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function MidContentManager({
  initialItems,
}: {
  initialItems: MidContentItem[];
}) {
  const [items, setItems] = useState<MidContentItem[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [newImage, setNewImage] = useState("");
  const [newHeadline, setNewHeadline] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newButtons, setNewButtons] = useState<LinkButton[]>([]);
  const { toast } = useToast();

  async function addItem() {
    if (!newHeadline.trim()) {
      toast("Headline is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/mid-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: newImage || null,
          headline: newHeadline.trim(),
          description: newDescription.trim(),
          linkButtons: newButtons,
          active: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewImage("");
      setNewHeadline("");
      setNewDescription("");
      setNewButtons([]);
      toast("Mid content added");
    } catch {
      toast("Failed to add", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    try {
      const res = await fetch(`/api/mid-content/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast("Deleted");
    } catch {
      toast("Failed to delete", "error");
    }
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/mid-content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, active: !active } : i))
      );
    } catch {
      toast("Failed to update", "error");
    }
  }

  async function updateItem(
    id: string,
    data: {
      image?: string | null;
      headline?: string;
      description?: string;
      linkButtons?: LinkButton[];
    }
  ) {
    try {
      const res = await fetch(`/api/mid-content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updated } : i))
      );
    } catch {
      toast("Failed to update", "error");
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const newOrder = [...items];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[index], newOrder[swap]] = [newOrder[swap], newOrder[index]];
    setItems(newOrder);
    try {
      await fetch("/api/mid-content/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newOrder.map((i) => i.id) }),
      });
    } catch {
      toast("Failed to reorder", "error");
    }
  }

  function addNewButton() {
    if (newButtons.length >= 5) return;
    setNewButtons((prev) => [...prev, { label: "", url: "" }]);
  }

  function updateNewButton(i: number, field: "label" | "url", value: string) {
    setNewButtons((prev) =>
      prev.map((b, j) => (j === i ? { ...b, [field]: value } : b))
    );
  }

  function removeNewButton(i: number) {
    setNewButtons((prev) => prev.filter((_, j) => j !== i));
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Add Mid Content Block</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optional)
            </label>
            <ImageUploader
              value={newImage}
              onChange={setNewImage}
              category="site"
              showImportFromUrl={true}
            />
          </div>
          <Input
            label="Headline"
            value={newHeadline}
            onChange={(e) => setNewHeadline(e.target.value)}
            placeholder="Section headline"
          />
          <Textarea
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Short description"
            rows={3}
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Link buttons (optional, max 5)
              </label>
              {newButtons.length < 5 && (
                <button
                  type="button"
                  onClick={addNewButton}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add button
                </button>
              )}
            </div>
            {newButtons.map((btn, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={btn.label}
                  onChange={(e) => updateNewButton(i, "label", e.target.value)}
                  placeholder="Button label"
                  className="flex-1"
                />
                <Input
                  value={btn.url}
                  onChange={(e) => updateNewButton(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeNewButton(i)}
                  className="text-red-500 hover:text-red-700 text-sm shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <Button onClick={addItem} loading={saving} size="sm">
            Add block
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Mid content blocks ({items.length})
          </h3>
        </div>
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            No blocks yet. Add one above to show content between links and recent
            posts on the homepage.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <li key={item.id} className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                  {item.image && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        unoptimized={item.image.startsWith("http")}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.headline}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description || "No description"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActive(item.id, item.active)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.active ? "Active" : "Hidden"}
                  </button>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {expandedId === item.id ? "Collapse" : "Edit"}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {expandedId === item.id && (
                  <MidContentEditForm
                    item={item}
                    onUpdate={(data) => updateItem(item.id, data)}
                    onClose={() => setExpandedId(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MidContentEditForm({
  item,
  onUpdate,
  onClose,
}: {
  item: MidContentItem;
  onUpdate: (data: {
    image?: string | null;
    headline?: string;
    description?: string;
    linkButtons?: LinkButton[];
  }) => void;
  onClose: () => void;
}) {
  const [image, setImage] = useState(item.image || "");
  const [headline, setHeadline] = useState(item.headline);
  const [description, setDescription] = useState(item.description);
  const [buttons, setButtons] = useState<LinkButton[]>(parseButtons(item.linkButtons));
  const [saving, setSaving] = useState(false);

  function addButton() {
    if (buttons.length >= 5) return;
    setButtons((prev) => [...prev, { label: "", url: "" }]);
  }

  function updateButton(i: number, field: "label" | "url", value: string) {
    setButtons((prev) =>
      prev.map((b, j) => (j === i ? { ...b, [field]: value } : b))
    );
  }

  function removeButton(i: number) {
    setButtons((prev) => prev.filter((_, j) => j !== i));
  }

  async function handleSave() {
    setSaving(true);
    onUpdate({
      image: image || null,
      headline,
      description,
      linkButtons: buttons.filter((b) => b.label.trim() && b.url.trim()),
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <ImageUploader
          value={image}
          onChange={setImage}
          category="site"
          showImportFromUrl={true}
        />
      </div>
      <Input
        label="Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Link buttons (max 5)
          </label>
          {buttons.length < 5 && (
            <button
              type="button"
              onClick={addButton}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add
            </button>
          )}
        </div>
        {buttons.map((btn, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={btn.label}
              onChange={(e) => updateButton(i, "label", e.target.value)}
              placeholder="Label"
              className="flex-1"
            />
            <Input
              value={btn.url}
              onChange={(e) => updateButton(i, "url", e.target.value)}
              placeholder="URL"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeButton(i)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} loading={saving} size="sm">
          Save changes
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
