import type { Metadata } from "next";

import { HomeSections } from "@/components/site/HomeSections";
import { VideoHero } from "@/components/site/VideoHero";

export const metadata: Metadata = {
  title: {
    absolute: "Business Websites Built to Earn Trust & Leads | Dark Labs",
  },
  description:
    "Founder-led business technology consulting, custom websites, lead systems, integrations, and web analytics for established businesses.",
};

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-black text-white">
      <VideoHero />
      <HomeSections />
    </main>
  );
}
