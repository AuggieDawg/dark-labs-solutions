import type { Metadata } from "next";

import { HomeSections } from "@/components/site/HomeSections";
import { VideoHero } from "@/components/site/VideoHero";

export const metadata: Metadata = {
  title: {
    absolute: "Custom Websites & Client Acquisition Systems | Dark Labs",
  },
  description:
    "Dark Labs builds custom websites, lead funnels, integrations, and measurement systems for established businesses.",
};

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-black text-white">
      <VideoHero />
      <HomeSections />
    </main>
  );
}
