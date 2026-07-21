import { FloatingConversionDock } from "@/components/site/FloatingConversionDock";
import { AttributionCapture } from "@/components/site/AttributionCapture";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AttributionCapture />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-2xl transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteNav />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
      <FloatingConversionDock />
    </div>
  );
}
