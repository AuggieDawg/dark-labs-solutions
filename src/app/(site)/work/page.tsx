export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <main className="bg-black px-6 py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
          Work
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
          Proof of work is being assembled.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
          This page will become the case-study and project showcase layer for
          Dark Labs. Early entries should document real builds, systems, and
          client outcomes.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {["Web systems", "Automation builds", "Platform work"].map((item) => (
            <div
              key={item}
              className="min-h-56 rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <p className="text-lg font-semibold">{item}</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Case study placeholder. Replace with real proof as projects
                become ready to publish.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
