import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { prisma } from "./prisma";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_WIDTH, IMAGE_QUALITY } from "./constants";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function processBufferAndSave(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
  category: "blog" | "site"
) {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB");
  }
  if (!ALLOWED_MIMES.has(mimeType)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG");
  }

  let processed: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  let outMime = mimeType;
  let ext: string;

  if (mimeType === "image/svg+xml") {
    processed = buffer;
    ext = "svg";
  } else {
    processed = await sharp(buffer)
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer();
    const metadata = await sharp(processed).metadata();
    width = metadata.width;
    height = metadata.height;
    outMime = "image/webp";
    ext = "webp";
  }

  const filename = `${generateId()}.${ext}`;
  const relativePath = `/uploads/${category}/${filename}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, processed);

  const upload = await prisma.upload.create({
    data: {
      filename,
      original: originalName,
      path: relativePath,
      mimeType: outMime,
      size: processed.length,
      width: width || null,
      height: height || null,
    },
  });

  return { url: relativePath, id: upload.id };
}

export async function processAndSaveImage(
  file: File,
  category: "blog" | "site" = "blog"
) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return processBufferAndSave(buffer, file.type, file.name, category);
}

/** Fetch image from URL, process, and save to uploads. All images end up on our server. */
export async function downloadAndSaveImageFromUrl(
  imageUrl: string,
  category: "blog" | "site" = "blog"
) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "HelaAds-ImageImport/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (!ALLOWED_MIMES.has(mime)) {
    throw new Error("URL did not return a valid image (JPEG, PNG, WebP, GIF, SVG)");
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const name = imageUrl.split("/").pop()?.split("?")[0] || "image";
  return processBufferAndSave(buffer, mime, name, category);
}
