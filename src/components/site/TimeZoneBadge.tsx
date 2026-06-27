"use client";

import { useMemo } from "react";

import { DARK_LABS_TIME_ZONE } from "@/lib/time/config";

function getShortTimeZoneName() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: DARK_LABS_TIME_ZONE,
    timeZoneName: "short",
  }).formatToParts(new Date());

  return parts.find((part) => part.type === "timeZoneName")?.value ?? "TZ";
}

export function TimeZoneBadge() {
  const shortName = useMemo(() => getShortTimeZoneName(), []);

  return (
    <div
      title={`Dark Labs timezone: ${DARK_LABS_TIME_ZONE}`}
      className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 lg:inline-flex"
    >
      <div className="grid gap-1 text-right">
        <span className="font-mono text-[10px] leading-none text-emerald-300">
          {shortName}
        </span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">
          Timezone
        </span>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 64 36"
        className="h-7 w-12 overflow-visible"
        role="img"
      >
        <rect
          x="1"
          y="1"
          width="62"
          height="34"
          rx="9"
          fill="rgba(255,255,255,0.035)"
          stroke="rgba(255,255,255,0.14)"
        />

        {/* Configured timezone band, shown as green vertical region */}
        <rect
          x="18"
          y="4"
          width="8"
          height="28"
          rx="4"
          fill="rgba(52, 211, 153, 0.28)"
          stroke="rgba(52, 211, 153, 0.75)"
        />

        {/* Simplified world map strokes */}
        <path
          d="M12 15c3-5 8-6 12-3 3 2 2 6-1 8-3 3-7 1-9-1-2-1-3-2-2-4Z"
          fill="rgba(255,255,255,0.26)"
        />
        <path
          d="M30 13c4-4 10-4 14-1 3 2 5 5 2 8-3 3-7 1-10 2-3 1-7 0-8-3-1-2 0-4 2-6Z"
          fill="rgba(255,255,255,0.22)"
        />
        <path
          d="M43 24c2-2 6-2 8 0 2 2 1 5-2 6-3 1-7 0-8-2-1-1 0-3 2-4Z"
          fill="rgba(255,255,255,0.18)"
        />
      </svg>
    </div>
  );
}
