import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createLeadFormToken,
  hashLeadAbuseIdentifier,
  verifyLeadFormToken,
} from "@/lib/leads/security-core";

const ISSUED_AT = Date.UTC(2026, 6, 21, 16, 0, 0);

describe("lead form tokens", () => {
  beforeEach(() => {
    vi.stubEnv(
      "LEAD_ABUSE_HASH_SECRET",
      "vitest-lead-abuse-secret-at-least-32-characters",
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a signed token only after the minimum completion time", () => {
    const token = createLeadFormToken(ISSUED_AT);

    expect(verifyLeadFormToken(token, ISSUED_AT + 749)).toBeNull();

    const verified = verifyLeadFormToken(token, ISSUED_AT + 750);

    expect(verified?.issuedAt).toEqual(new Date(ISSUED_AT));
    expect(verified?.idempotencyKey).toHaveLength(24);
  });

  it("rejects future, expired, malformed, and tampered tokens", () => {
    const token = createLeadFormToken(ISSUED_AT);
    const [timestamp, nonce, signature] = token.split(".");

    expect(verifyLeadFormToken(token, ISSUED_AT - 1)).toBeNull();
    expect(
      verifyLeadFormToken(token, ISSUED_AT + 24 * 60 * 60 * 1_000 + 1),
    ).toBeNull();
    expect(verifyLeadFormToken("malformed", ISSUED_AT + 1_000)).toBeNull();
    expect(
      verifyLeadFormToken(
        `${timestamp}.${nonce}-tampered.${signature}`,
        ISSUED_AT + 1_000,
      ),
    ).toBeNull();
    expect(
      verifyLeadFormToken(
        `${timestamp}.${nonce}.${signature?.slice(1)}`,
        ISSUED_AT + 1_000,
      ),
    ).toBeNull();
  });

  it("returns a stable replay identity while issuing distinct form tokens", () => {
    const token = createLeadFormToken(ISSUED_AT);
    const otherToken = createLeadFormToken(ISSUED_AT);
    const first = verifyLeadFormToken(token, ISSUED_AT + 1_000);
    const replay = verifyLeadFormToken(token, ISSUED_AT + 5_000);

    expect(replay?.idempotencyKey).toBe(first?.idempotencyKey);
    expect(otherToken).not.toBe(token);
  });

  it("normalizes abuse identifiers and separates their namespaces", () => {
    const normalized = hashLeadAbuseIdentifier("email", " ADA@Example.com ");

    expect(hashLeadAbuseIdentifier("email", "ada@example.com")).toBe(
      normalized,
    );
    expect(hashLeadAbuseIdentifier("ip", "ada@example.com")).not.toBe(
      normalized,
    );
  });
});
