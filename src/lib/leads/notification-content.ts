import { ENGAGEMENTS } from "@/config/engagements";
import {
  LEAD_BUDGET_OPTIONS,
  LEAD_TIMELINE_OPTIONS,
} from "@/lib/leads/validation";

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function labelFor<T extends readonly { value: string; label: string }[]>(
  options: T,
  value: string | null,
) {
  return (
    options.find((option) => option.value === value)?.label ?? "Not provided"
  );
}

export type LeadEmailRecord = {
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  businessName: string;
  websiteUrl: string | null;
  engagementSlug: string | null;
  businessConstraint: string;
  desiredOutcome: string | null;
  timeline: string | null;
  budgetRange: string | null;
  referralSource: string | null;
  sourcePath: string | null;
  landingPath: string | null;
  referrerUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  createdAt: Date;
};

export function buildOwnerLeadEmail(lead: LeadEmailRecord) {
  const engagement = ENGAGEMENTS.find(
    (item) => item.slug === lead.engagementSlug,
  );
  const name = `${lead.firstName} ${lead.lastName}`;
  const subject = cleanHeader(
    `New Dark Labs lead: ${lead.businessName} (${lead.reference})`,
  );

  const text = [
    "A new project inquiry was accepted and stored in the Command Center.",
    "",
    `Reference: ${lead.reference}`,
    `Accepted: ${lead.createdAt.toISOString()}`,
    `Name: ${name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone ?? "Not provided"}`,
    `Business: ${lead.businessName}`,
    `Website: ${lead.websiteUrl ?? "Not provided"}`,
    `Preferred engagement: ${engagement?.name ?? "Not selected"}`,
    `Timeline: ${labelFor(LEAD_TIMELINE_OPTIONS, lead.timeline)}`,
    `Investment range: ${labelFor(LEAD_BUDGET_OPTIONS, lead.budgetRange)}`,
    "",
    "Business constraint",
    lead.businessConstraint,
    "",
    "Desired outcome",
    lead.desiredOutcome ?? "Not provided",
    "",
    `Referral source: ${lead.referralSource ?? "Not provided"}`,
    `Source path: ${lead.sourcePath ?? "Not available"}`,
    `Landing path: ${lead.landingPath ?? "Not available"}`,
    `Referrer: ${lead.referrerUrl ?? "Not available"}`,
    `UTM source: ${lead.utmSource ?? "Not available"}`,
    `UTM medium: ${lead.utmMedium ?? "Not available"}`,
    `UTM campaign: ${lead.utmCampaign ?? "Not available"}`,
    `UTM term: ${lead.utmTerm ?? "Not available"}`,
    `UTM content: ${lead.utmContent ?? "Not available"}`,
  ].join("\n");

  return { subject, text };
}
