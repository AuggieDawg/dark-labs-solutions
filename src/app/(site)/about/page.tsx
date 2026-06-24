export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="bg-black px-6 py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            About
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Dark Labs builds operational infrastructure.
          </h1>
        </div>

        <div className="space-y-6 text-base leading-8 text-white/55 md:text-lg">
          <p>
            Dark Labs exists to help serious businesses modernize the systems
            behind their work: websites, automations, dashboards, client
            portals, and internal operating platforms.
          </p>
          <p>
            The company is being built around disciplined engineering,
            workspace-based access control, professional design, and practical
            business outcomes.
          </p>
          <p>
            The long-term goal is to turn repeated client needs into reusable
            software infrastructure.
          </p>
        </div>
      </div>
    </main>
  );
}
