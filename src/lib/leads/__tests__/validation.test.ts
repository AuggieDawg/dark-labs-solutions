import { describe, expect, it } from "vitest";

import {
  flattenLeadFieldErrors,
  leadInputFromFormData,
  leadIntakeSchema,
} from "@/lib/leads/validation";

function validLeadInput(overrides: Record<string, string> = {}) {
  return {
    firstName: "  Ada\nLovelace  ",
    lastName: "Byron",
    email: "  ADA@EXAMPLE.COM ",
    phone: "",
    businessName: "Analytical Engines",
    websiteUrl: "example.com/work",
    engagementSlug: "conversion-website",
    businessConstraint:
      "We need a clearer acquisition path that turns qualified traffic into conversations.",
    desiredOutcome: "Increase qualified project inquiries.",
    timeline: "ONE_TO_THREE_MONTHS",
    budgetRange: "FROM_10000_TO_20000",
    referralSource: "Referral",
    privacyAcknowledged: "on",
    formToken: "signed-form-token",
    companyWebsite: "",
    sourcePath: "/contact",
    landingPath: "/services",
    referrerUrl: "https://example.com",
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "summer",
    utmTerm: "",
    utmContent: "cta",
    ...overrides,
  };
}

describe("leadIntakeSchema", () => {
  it("normalizes safe contact data and canonicalizes an HTTP website URL", () => {
    const parsed = leadIntakeSchema.parse(validLeadInput());

    expect(parsed.firstName).toBe("Ada Lovelace");
    expect(parsed.email).toBe("ada@example.com");
    expect(parsed.websiteUrl).toBe("https://example.com/work");
    expect(parsed.phone).toBeUndefined();
    expect(parsed.utmTerm).toBeUndefined();
  });

  it("rejects invalid contact, qualification, consent, and enum values", () => {
    const result = leadIntakeSchema.safeParse(
      validLeadInput({
        email: "not-an-email",
        businessConstraint: "Too short",
        engagementSlug: "invented-engagement",
        privacyAcknowledged: "",
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected lead validation to fail.");
    }

    const errors = flattenLeadFieldErrors(result.error);

    expect(errors.email).toBeDefined();
    expect(errors.businessConstraint).toBeDefined();
    expect(errors.engagementSlug).toBeDefined();
    expect(errors.privacyAcknowledged).toBeDefined();
  });

  it("rejects unsupported control characters in single-line fields", () => {
    const result = leadIntakeSchema.safeParse(
      validLeadInput({ firstName: "Ada\u0000Lovelace" }),
    );

    expect(result.success).toBe(false);
  });

  it("reads only allowlisted form fields", () => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(validLeadInput())) {
      formData.set(key, value);
    }

    formData.set("workspaceId", "attacker-controlled-workspace");
    formData.set("status", "CONVERTED");

    const input = leadInputFromFormData(formData);

    expect(input).not.toHaveProperty("workspaceId");
    expect(input).not.toHaveProperty("status");
    expect(leadIntakeSchema.safeParse(input).success).toBe(true);
  });
});
