import { z } from "zod";

import { ENGAGEMENTS } from "@/config/engagements";

export const LEAD_TIMELINE_OPTIONS = [
  { value: "IMMEDIATELY", label: "As soon as there is a fit" },
  { value: "ONE_TO_THREE_MONTHS", label: "Within 1–3 months" },
  { value: "THREE_TO_SIX_MONTHS", label: "Within 3–6 months" },
  { value: "EXPLORING", label: "Exploring the right approach" },
] as const;

export const LEAD_BUDGET_OPTIONS = [
  { value: "UNDER_5000", label: "Under $5,000" },
  { value: "FROM_5000_TO_10000", label: "$5,000–$10,000" },
  { value: "FROM_10000_TO_20000", label: "$10,000–$20,000" },
  { value: "FROM_20000_TO_30000", label: "$20,000–$30,000" },
  { value: "ABOVE_30000", label: "$30,000+" },
  { value: "NOT_SURE", label: "Not sure yet" },
] as const;

const ENGAGEMENT_SLUGS = ENGAGEMENTS.map((engagement) => engagement.slug) as [
  (typeof ENGAGEMENTS)[number]["slug"],
  ...(typeof ENGAGEMENTS)[number]["slug"][],
];

const TIMELINE_VALUES = LEAD_TIMELINE_OPTIONS.map((option) => option.value) as [
  (typeof LEAD_TIMELINE_OPTIONS)[number]["value"],
  ...(typeof LEAD_TIMELINE_OPTIONS)[number]["value"][],
];

const BUDGET_VALUES = LEAD_BUDGET_OPTIONS.map((option) => option.value) as [
  (typeof LEAD_BUDGET_OPTIONS)[number]["value"],
  ...(typeof LEAD_BUDGET_OPTIONS)[number]["value"][],
];

const cleanSingleLine = (value: string) => value.replace(/\s+/g, " ").trim();
const hasControlCharacters = (value: string) =>
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);

const requiredSingleLine = (label: string, min: number, max: number) =>
  z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(min, `${label} is required.`)
        .max(max, `${label} must be ${max} characters or fewer.`)
        .refine(
          (value) => !hasControlCharacters(value),
          `${label} contains unsupported characters.`,
        ),
    );

const optionalSingleLine = (max: number) =>
  z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .max(max, `Use ${max} characters or fewer.`)
        .refine(
          (value) => !hasControlCharacters(value),
          "This field contains unsupported characters.",
        ),
    )
    .transform((value) => value || undefined);

const optionalUrl = z
  .string()
  .transform((value) => value.trim())
  .pipe(z.string().max(500, "Website URL must be 500 characters or fewer."))
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  })
  .pipe(z.url("Enter a valid website URL.").optional());

const optionalAttribution = z
  .string()
  .trim()
  .max(500)
  .transform((value) => value || undefined);

export const leadIntakeSchema = z.object({
  firstName: requiredSingleLine("First name", 1, 80),
  lastName: requiredSingleLine("Last name", 1, 80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Email must be 254 characters or fewer.")
    .pipe(z.email("Enter a valid email address.")),
  phone: optionalSingleLine(40),
  businessName: requiredSingleLine("Business name", 2, 120),
  websiteUrl: optionalUrl,
  engagementSlug: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(z.enum(ENGAGEMENT_SLUGS).optional()),
  businessConstraint: z
    .string()
    .trim()
    .min(20, "Give us at least a sentence about the business constraint.")
    .max(2_000, "Use 2,000 characters or fewer."),
  desiredOutcome: z
    .string()
    .trim()
    .max(1_000, "Use 1,000 characters or fewer.")
    .transform((value) => value || undefined),
  timeline: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(z.enum(TIMELINE_VALUES).optional()),
  budgetRange: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(z.enum(BUDGET_VALUES).optional()),
  referralSource: optionalSingleLine(200),
  privacyAcknowledged: z.literal("on", {
    error: "Confirm that you have read the privacy notice.",
  }),
  formToken: z.string().min(1),
  companyWebsite: z.string().max(500).optional().default(""),
  sourcePath: optionalAttribution,
  landingPath: optionalAttribution,
  referrerUrl: optionalAttribution,
  utmSource: optionalAttribution,
  utmMedium: optionalAttribution,
  utmCampaign: optionalAttribution,
  utmTerm: optionalAttribution,
  utmContent: optionalAttribution,
});

export type LeadIntakeInput = z.infer<typeof leadIntakeSchema>;

export function leadInputFromFormData(formData: FormData) {
  return Object.fromEntries(
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "businessName",
      "websiteUrl",
      "engagementSlug",
      "businessConstraint",
      "desiredOutcome",
      "timeline",
      "budgetRange",
      "referralSource",
      "privacyAcknowledged",
      "formToken",
      "companyWebsite",
      "sourcePath",
      "landingPath",
      "referrerUrl",
      "utmSource",
      "utmMedium",
      "utmCampaign",
      "utmTerm",
      "utmContent",
    ].map((key) => [key, formData.get(key) ?? ""]),
  );
}

export function flattenLeadFieldErrors(error: z.ZodError) {
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
