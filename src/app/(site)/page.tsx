import { HomeSections } from "@/components/site/HomeSections";
import { VideoHero } from "@/components/site/VideoHero";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-black text-white">
      <VideoHero />
      <HomeSections />
    </main>
  );
}
