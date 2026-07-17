import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const DEFAULT_MAX_IMAGE_SIZE = 12 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
}

type SavePublicImageUploadInput = {
  file: File | null;
  segments: string[];
  maxBytes?: number;
};

export async function savePublicImageUpload({
  file,
  segments,
  maxBytes = DEFAULT_MAX_IMAGE_SIZE,
}: SavePublicImageUploadInput) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = ALLOWED_IMAGE_TYPES.get(file.type);

  if (!extension) {
    throw new Error("Only JPG, PNG, and WebP images are supported");
  }

  if (file.size > maxBytes) {
    throw new Error(`Image is too large. Max size is ${maxBytes} bytes.`);
  }

  const safeSegments = segments.map(sanitizeSegment).filter(Boolean);

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    ...safeSegments,
  );

  await mkdir(uploadDir, {
    recursive: true,
  });

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const absolutePath = path.join(uploadDir, filename);
  const publicUrl = `/uploads/${safeSegments.join("/")}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return publicUrl;
}
