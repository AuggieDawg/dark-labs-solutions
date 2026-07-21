"use client";

import { useEffect } from "react";

export const ATTRIBUTION_STORAGE_KEY = "dark-labs:first-touch:v1";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

function limited(value: string | null) {
  return (
    value
      ?.replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 500) ?? ""
  );
}

function safeReferrer(value: string) {
  try {
    const referrer = new URL(value);

    if (referrer.protocol !== "http:" && referrer.protocol !== "https:") {
      return "";
    }

    return limited(`${referrer.origin}${referrer.pathname}`);
  } catch {
    return "";
  }
}

export function AttributionCapture() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) {
        return;
      }

      const url = new URL(window.location.href);
      const campaign = new URLSearchParams();

      for (const key of UTM_KEYS) {
        const value = limited(url.searchParams.get(key));

        if (value) {
          campaign.set(key, value);
        }
      }

      window.sessionStorage.setItem(
        ATTRIBUTION_STORAGE_KEY,
        JSON.stringify({
          landingPath: limited(
            `${url.pathname}${campaign.size ? `?${campaign.toString()}` : ""}`,
          ),
          referrerUrl: safeReferrer(document.referrer),
          utmSource: limited(url.searchParams.get("utm_source")),
          utmMedium: limited(url.searchParams.get("utm_medium")),
          utmCampaign: limited(url.searchParams.get("utm_campaign")),
          utmTerm: limited(url.searchParams.get("utm_term")),
          utmContent: limited(url.searchParams.get("utm_content")),
        }),
      );
    } catch {
      // Storage can be unavailable in hardened browser modes. Server-captured
      // attribution remains a functional fallback.
    }
  }, []);

  return null;
}
