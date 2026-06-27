export const DARK_LABS_TIME_ZONE =
  process.env.NEXT_PUBLIC_DARK_LABS_TIME_ZONE || "America/Denver";

export function getDarkLabsTimeZoneLabel() {
  return DARK_LABS_TIME_ZONE.replace("_", " ");
}
