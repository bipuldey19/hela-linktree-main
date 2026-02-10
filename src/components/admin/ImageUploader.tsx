"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  category?: "blog" | "site";
  /** Show "Import from URL" so every image is stored on our server */
  showImportFromUrl?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  category = "blog",
  showImportFromUrl = true,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleImportFromUrl() {
    const url = importUrl.trim();
    if (!url || !url.startsWith("http")) {
      setError("Enter a valid image URL");
      return;
    }
    setError("");
    setImporting(true);
    try {
      const res = await fetch("/api/upload/from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, category }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Import failed");
      }
      const data = await res.json();
      onChange(data.url);
      setImportUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const busy = uploading || importing;
  const isLocal = value.startsWith("/uploads");
  const isExternal = value.startsWith("http");

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group">
          <Image
            src={value}
            alt="Uploaded image"
            width={400}
            height={225}
            unoptimized={isExternal}
            className="w-full max-w-md rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="!text-white !bg-white/20 hover:!bg-white/30"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="!text-white !bg-red-500/80 hover:!bg-red-500"
              onClick={() => onChange("")}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !busy && inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {busy ? (
            <p className="text-sm text-gray-500">
              {importing ? "Importing from URL..." : "Uploading..."}
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Click or drag & drop an image
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPEG, PNG, WebP, GIF, SVG (max 5MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {showImportFromUrl && (
        <div className="flex flex-wrap items-end gap-2">
          <Input
            label="Or import from URL (image will be saved on server)"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 min-w-[200px]"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleImportFromUrl}
            loading={importing}
            disabled={!importUrl.trim() || uploading}
          >
            Import
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
