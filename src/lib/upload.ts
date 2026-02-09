import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { prisma } from "./prisma";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_WIDTH, IMAGE_QUALITY } from "./constants";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export async function processAndSaveImage(
  file: File,
  category: "blog" | "site" = "blog"
) {
  // Validate type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG");
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Process with Sharp (skip SVG)
  let processed: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  let mimeType: string;

  if (file.type === "image/svg+xml") {
    processed = buffer;
    mimeType = "image/svg+xml";
  } else {
    processed = await sharp(buffer)
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer();

    const metadata = await sharp(processed).metadata();
    width = metadata.width;
    height = metadata.height;
    mimeType = "image/webp";
  }

  // Save to filesystem
  const filename =
    file.type === "image/svg+xml"
      ? `${generateId()}.svg`
      : `${generateId()}.webp`;
  const relativePath = `/uploads/${category}/${filename}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, processed);

  // Record in database
  const upload = await prisma.upload.create({
    data: {
      filename,
      original: file.name,
      path: relativePath,
      mimeType,
      size: processed.length,
      width: width || null,
      height: height || null,
    },
  });

  return { url: relativePath, id: upload.id };
}
