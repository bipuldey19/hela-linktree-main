import { prisma } from "@/lib/prisma";
import MediaLibraryClient from "./MediaLibraryClient";

export default async function MediaPage() {
  const uploads = await prisma.upload.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Media Library</h1>
      <MediaLibraryClient
        uploads={uploads.map((u) => ({
          id: u.id,
          filename: u.filename,
          original: u.original,
          path: u.path,
          mimeType: u.mimeType,
          size: u.size,
          width: u.width,
          height: u.height,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
