import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const FORM_TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1_000;
const FORM_TOKEN_MIN_AGE_MS = 750;

function getSecuritySecret() {
  const secret =
    process.env.LEAD_ABUSE_HASH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();

  if (!secret || secret.length < 16) {
    throw new Error(
      "LEAD_ABUSE_HASH_SECRET or NEXTAUTH_SECRET must be at least 16 characters.",
    );
  }

  return secret;
}

function signatureFor(payload: string) {
  return createHmac("sha256", getSecuritySecret())
    .update(payload)
    .digest("base64url");
}

export function createLeadFormToken(now = Date.now()) {
  const payload = `${now}.${randomBytes(18).toString("base64url")}`;
  return `${payload}.${signatureFor(payload)}`;
}

export function verifyLeadFormToken(token: string, now = Date.now()) {
  const [issuedAtValue, nonce, suppliedSignature, ...extra] = token.split(".");

  if (!issuedAtValue || !nonce || !suppliedSignature || extra.length > 0) {
    return null;
  }

  const issuedAt = Number(issuedAtValue);

  if (!Number.isSafeInteger(issuedAt)) {
    return null;
  }

  const age = now - issuedAt;

  if (age < FORM_TOKEN_MIN_AGE_MS || age > FORM_TOKEN_MAX_AGE_MS) {
    return null;
  }

  const payload = `${issuedAtValue}.${nonce}`;
  const expectedSignature = signatureFor(payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  return {
    issuedAt: new Date(issuedAt),
    idempotencyKey: nonce,
  };
}

export function hashLeadAbuseIdentifier(kind: "email" | "ip", value: string) {
  return createHmac("sha256", getSecuritySecret())
    .update(`${kind}:${value.trim().toLowerCase()}`)
    .digest("hex");
}
