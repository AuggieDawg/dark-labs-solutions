import { randomUUID } from "crypto";

import { put } from "@vercel/blob";

const DEFAULT_MAX_IMAGE_SIZE = 3 * 1024 * 1024;

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
    const maxMegabytes = Math.floor(maxBytes / (1024 * 1024));
    throw new Error(`Image is too large. Maximum size is ${maxMegabytes} MB.`);
  }

  const safeSegments = segments.map(sanitizeSegment).filter(Boolean);
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const pathname = ["uploads", ...safeSegments, filename].join("/");

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}
