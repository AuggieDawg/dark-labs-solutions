import { ProspectChannel, ProspectStatus } from "@/generated/prisma";

import { z } from "zod";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function hasUnsupportedControlCharacters(value: string) {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function cleanSingleLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function optionalSingleLine(maxLength: number) {
  return z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .transform(cleanSingleLine)
      .pipe(
        z
          .string()
          .max(maxLength)
          .refine(
            (value) => !hasUnsupportedControlCharacters(value),
            "This field contains unsupported characters",
          ),
      )
      .optional(),
  );
}

function optionalMultiline(maxLength: number) {
  return z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .trim()
      .max(maxLength)
      .refine(
        (value) => !hasUnsupportedControlCharacters(value),
        "This field contains unsupported characters",
      )
      .optional(),
  );
}

const optionalEmail = z.preprocess(
  emptyStringToUndefined,
  z.string().email("Enter a valid email address").max(254).optional(),
);

const optionalHttpUrl = z.preprocess(
  emptyStringToUndefined,
  z
    .string()
    .max(2_048)
    .url("Enter a complete website URL")
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    }, "Website URL must begin with http:// or https://")
    .optional(),
);

const optionalDate = z.preprocess(
  emptyStringToUndefined,
  z
    .string()
    .regex(DATE_PATTERN, "Enter a valid date")
    .transform((value, context) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, 12));

      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day
      ) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid date",
        });

        return z.NEVER;
      }

      return date;
    })
    .optional(),
);

const optimisticTimestamp = z
  .string()
  .datetime({ offset: true })
  .transform((value) => new Date(value));

const prospectProfileFields = {
  businessName: z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(1, "Business name is required")
        .max(160)
        .refine(
          (value) => !hasUnsupportedControlCharacters(value),
          "Business name contains unsupported characters",
        ),
    ),
  contactName: optionalSingleLine(120),
  email: optionalEmail,
  phone: optionalSingleLine(40),
  websiteUrl: optionalHttpUrl,
  industry: optionalSingleLine(120),
  location: optionalSingleLine(160),
  source: optionalSingleLine(160),
  valueHypothesis: optionalMultiline(4_000),
};

export const createProspectSchema = z.object({
  ...prospectProfileFields,
  status: z.enum(ProspectStatus).default(ProspectStatus.TO_CONTACT),
  nextFollowUpDate: optionalDate,
  internalNotes: optionalMultiline(12_000),
});

export const updateProspectSchema = z.object({
  ...prospectProfileFields,
  status: z.enum(ProspectStatus),
  nextFollowUpDate: optionalDate,
  internalNotes: optionalMultiline(12_000),
  updatedAt: optimisticTimestamp,
});

export const recordProspectOutreachSchema = z.object({
  channel: z.enum(ProspectChannel),
  outcome: z
    .string()
    .trim()
    .min(1, "Record a short outcome or next step")
    .max(2_000)
    .refine(
      (value) => !hasUnsupportedControlCharacters(value),
      "Outcome contains unsupported characters",
    ),
  nextFollowUpDate: optionalDate,
  updatedAt: optimisticTimestamp,
});

export type CreateProspectInput = z.infer<typeof createProspectSchema>;
export type UpdateProspectInput = z.infer<typeof updateProspectSchema>;
export type RecordProspectOutreachInput = z.infer<
  typeof recordProspectOutreachSchema
>;

export function normalizeProspectEmail(email: string | undefined) {
  return email?.trim().toLowerCase() ?? null;
}

export function prospectFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function flattenProspectFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return fieldErrors;
}
