"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import ImageUploader from "@/components/admin/ImageUploader";

interface Upload {
  id: string;
  filename: string;
  original: string;
  path: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export default function MediaLibraryClient({
  uploads: initialUploads,
}: {
  uploads: Upload[];
}) {
  const [uploads, setUploads] = useState(initialUploads);
  const [newImage, setNewImage] = useState("");
  const { toast } = useToast();

  function handleUploaded(url: string) {
    setNewImage(url);
    // Reload the page to show new upload
    window.location.reload();
  }

  async function copyUrl(path: string) {
    try {
      await navigator.clipboard.writeText(path);
      toast("URL copied to clipboard");
    } catch {
      toast("Failed to copy", "error");
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Upload Image</h3>
        <ImageUploader
          value={newImage}
          onChange={handleUploaded}
          category="blog"
        />
      </div>

      {uploads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center text-gray-500 text-sm">
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
            >
              <div className="aspect-square relative bg-gray-100">
                {upload.mimeType === "image/svg+xml" ? (
                  <img
                    src={upload.path}
                    alt={upload.original}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Image
                    src={upload.path}
                    alt={upload.original}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {upload.original}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(upload.size)}
                  {upload.width && upload.height
                    ? ` · ${upload.width}×${upload.height}`
                    : ""}
                </p>
                <button
                  onClick={() => copyUrl(upload.path)}
                  className="text-xs text-[var(--color-primary)] hover:underline mt-1"
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
