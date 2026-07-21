import type { Metadata } from "next";

import { HomeSections } from "@/components/site/HomeSections";
import { VideoHero } from "@/components/site/VideoHero";

export const metadata: Metadata = {
  title: {
    absolute: "Conversion Websites & Client Acquisition Systems | Dark Labs",
  },
  description:
    "Dark Labs builds conversion-focused websites, lead systems, integrations, and analytics for established service businesses.",
};

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-black text-white">
      <VideoHero />
      <HomeSections />
    </main>
  );
}
