import { describe, expect, it } from "vitest";

import { buildOwnerLeadEmail } from "@/lib/leads/notification-content";

function leadEmailRecord() {
  return {
    reference: "DL-2026-ABC123",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: null,
    businessName: "Analytical Engines",
    websiteUrl: "https://example.com",
    engagementSlug: "conversion-website",
    businessConstraint:
      "The current website does not qualify project inquiries.",
    desiredOutcome: "Create a measurable path to qualified conversations.",
    timeline: "ONE_TO_THREE_MONTHS",
    budgetRange: "FROM_10000_TO_20000",
    referralSource: "Referral",
    sourcePath: "/contact",
    landingPath: "/services",
    referrerUrl: "https://example.com/article",
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "summer",
    utmTerm: null,
    utmContent: "primary-cta",
    createdAt: new Date("2026-07-21T16:00:00.000Z"),
  };
}

describe("owner lead email", () => {
  it("formats a complete plain-text notification", () => {
    const email = buildOwnerLeadEmail(leadEmailRecord());

    expect(email.subject).toBe(
      "New Dark Labs lead: Analytical Engines (DL-2026-ABC123)",
    );
    expect(email.text).toContain("Reference: DL-2026-ABC123");
    expect(email.text).toContain("Accepted: 2026-07-21T16:00:00.000Z");
    expect(email.text).toContain("Preferred engagement: Conversion Website");
    expect(email.text).toContain("Investment range: $10,000–$20,000");
  });

  it("removes CR and LF characters from the message subject", () => {
    const email = buildOwnerLeadEmail({
      ...leadEmailRecord(),
      reference: "DL-2026-ABC123\r\nX-Injected: yes",
      businessName: "Analytical Engines\r\nBcc: attacker@example.com",
    });

    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.subject).toContain("Bcc: attacker@example.com");
  });
});
