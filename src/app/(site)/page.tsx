import Link from "next/link";

const capabilities = [
  "Premium websites",
  "Business automations",
  "Internal dashboards",
  "Client portals",
  "Workflow systems",
  "Future AI infrastructure",
];

const stats = [
  { label: "Public Site", value: "01" },
  { label: "Command Center", value: "02" },
  { label: "Client Portal", value: "03" },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-black text-white">
      <section className="relative min-h-[calc(100vh-80px)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 55% 15%, rgba(255,255,255,0.14), transparent 32%), radial-gradient(circle at 20% 30%, rgba(90,100,255,0.12), transparent 28%), linear-gradient(180deg, #07070a 0%, #000000 100%)",
          }}
        />

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
              Intelligent Business Systems
            </p>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl">
              Build the machine behind the business.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
              Dark Labs builds websites, automations, dashboards, and private
              operating platforms for businesses that need modern digital
              infrastructure.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Start a Project
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                View Services
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-white/10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-r border-white/10 py-5 last:border-r-0"
                >
                  <p className="font-mono text-xl text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-10 rounded-full bg-white/10 blur-3xl"
            />

            <div className="relative rounded-[2.25rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black">
              <div className="aspect-[4/5] rounded-[1.65rem] border border-white/10 bg-black/80 p-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="ml-auto font-mono text-xs text-white/30">
                    monolith.preview
                  </span>
                </div>

                <div className="mt-7 space-y-3 font-mono text-xs text-white/35">
                  {[
                    "workspace.darkLabs.boot()",
                    "auth.requireOwner(email)",
                    "clients.pipeline.sync()",
                    "projects.status.compute()",
                    "tasks.map.dependencies()",
                    "goals.execute.weekly()",
                    "knowledge.index.memory()",
                  ].map((line) => (
                    <div
                      key={line}
                      className="rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2"
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {capabilities.slice(0, 4).map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <p className="text-xs leading-5 text-white/45">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-white/25">
              Code monolith hero comes next
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-16 md:grid-cols-3">
          {[
            {
              title: "Public presence",
              body: "A premium website that communicates capability, taste, and trust.",
            },
            {
              title: "Operational systems",
              body: "Dashboards, automations, and internal tooling built around real workflows.",
            },
            {
              title: "Private platform",
              body: "The long-term command center for clients, projects, goals, and knowledge.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-black/40 p-6"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
