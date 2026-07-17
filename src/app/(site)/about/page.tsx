export const metadata = {
  title: "About",
  description:
    "Dark Labs is a founder-led custom website and digital systems agency for established businesses.",
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
            Custom websites built as measurable business systems.
          </h1>
        </div>

        <div className="space-y-6 text-base leading-8 text-white/55 md:text-lg">
          <p>
            Dark Labs is a custom website and digital systems agency for
            established businesses that need more leads, better visibility, and
            less operational friction.
          </p>
          <p>
            Each engagement begins with the customer flow, then connects a
            conversion-focused website, lead path, targeted integrations, and
            measurement around the way the business actually operates.
          </p>
          <p>
            You work directly with the person designing, building, launching,
            and supporting the system. After launch, Dark Labs validates the
            conversion path and measures what happens during stabilization
            before recommending the next investment.
          </p>
        </div>
      </div>
    </main>
  );
}
