"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

async function requireOwnedProject(projectId: string) {
  const owner = await requireOwner();

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: owner.workspaceId,
    },
    select: {
      id: true,
      name: true,
      workspaceId: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return {
    owner,
    project,
  };
}

async function saveImageUpload(projectId: string, file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = ALLOWED_IMAGE_TYPES.get(file.type);

  if (!extension) {
    throw new Error("Only JPG, PNG, and WebP images are supported");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image is too large. Max size is 12MB.");
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "projects",
    projectId,
    "before-after",
  );

  await mkdir(uploadDir, {
    recursive: true,
  });

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const absolutePath = path.join(uploadDir, filename);
  const publicUrl = `/uploads/projects/${projectId}/before-after/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return publicUrl;
}

export async function createProjectBeforeAfterAssetAction(
  projectId: string,
  formData: FormData,
) {
  const { owner, project } = await requireOwnedProject(projectId);

  const beforeValue = formData.get("beforeImage");
  const afterValue = formData.get("afterImage");

  const beforeImage =
    beforeValue instanceof File && beforeValue.size > 0 ? beforeValue : null;
  const afterImage =
    afterValue instanceof File && afterValue.size > 0 ? afterValue : null;

  if (!beforeImage && !afterImage) {
    throw new Error("Upload at least one before or after image");
  }

  const [beforeImageUrl, afterImageUrl] = await Promise.all([
    saveImageUpload(project.id, beforeImage),
    saveImageUpload(project.id, afterImage),
  ]);

  const asset = await prisma.projectBeforeAfterAsset.create({
    data: {
      projectId: project.id,
      label: optionalText(formData, "label"),
      notes: optionalText(formData, "notes"),
      beforeImageUrl,
      afterImageUrl,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectBeforeAfterAsset",
      entityId: asset.id,
      action: "project_before_after.created",
      summary: `Added before/after asset to ${project.name}`,
      metadata: {
        projectId: project.id,
        hasBefore: Boolean(beforeImageUrl),
        hasAfter: Boolean(afterImageUrl),
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${project.id}`);
  revalidatePath(`/owner/projects/${project.id}/before-after`);
}
