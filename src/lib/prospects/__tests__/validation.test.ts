import { describe, expect, it } from "vitest";

import {
  createProspectSchema,
  normalizeProspectEmail,
  recordProspectOutreachSchema,
  updateProspectSchema,
} from "@/lib/prospects/validation";

describe("prospect validation", () => {
  it("normalizes an optional prospect email", () => {
    expect(normalizeProspectEmail("  Owner@Example.COM ")).toBe(
      "owner@example.com",
    );
    expect(normalizeProspectEmail(undefined)).toBeNull();
  });

  it("requires a business name", () => {
    const result = createProspectSchema.safeParse({
      businessName: "   ",
      status: "TO_CONTACT",
    });

    expect(result.success).toBe(false);
  });

  it("accepts only http or https website URLs", () => {
    const valid = createProspectSchema.safeParse({
      businessName: "Example Business",
      websiteUrl: "https://example.com/services",
      status: "TO_CONTACT",
    });
    const invalid = createProspectSchema.safeParse({
      businessName: "Example Business",
      websiteUrl: "javascript:alert(1)",
      status: "TO_CONTACT",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("rejects calendar dates that roll into another month", () => {
    const result = createProspectSchema.safeParse({
      businessName: "Example Business",
      status: "TO_CONTACT",
      nextFollowUpDate: "2026-02-31",
    });

    expect(result.success).toBe(false);
  });

  it("parses an exact follow-up date at a stable UTC hour", () => {
    const result = createProspectSchema.safeParse({
      businessName: "Example Business",
      status: "TO_CONTACT",
      nextFollowUpDate: "2026-07-31",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nextFollowUpDate?.toISOString()).toBe(
        "2026-07-31T12:00:00.000Z",
      );
    }
  });

  it("requires valid optimistic timestamps on profile edits", () => {
    const valid = updateProspectSchema.safeParse({
      businessName: "Example Business",
      status: "CONTACTED",
      updatedAt: "2026-07-21T18:00:00.000Z",
    });
    const invalid = updateProspectSchema.safeParse({
      businessName: "Example Business",
      status: "CONTACTED",
      updatedAt: "yesterday",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("requires a meaningful outcome when recording outreach", () => {
    const result = recordProspectOutreachSchema.safeParse({
      channel: "FACEBOOK",
      outcome: "   ",
      updatedAt: "2026-07-21T18:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});
