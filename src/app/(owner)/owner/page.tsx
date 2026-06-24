export const metadata = {
  title: "Command Center",
};

const cards = [
  {
    label: "Clients",
    value: "0",
    detail: "Client CRM module comes after auth.",
  },
  {
    label: "Projects",
    value: "0",
    detail: "Project tracking will connect to Prisma.",
  },
  {
    label: "Tasks",
    value: "0",
    detail: "Workbench execution layer is planned.",
  },
  {
    label: "Goals",
    value: "0",
    detail: "Personal and business goals will live here.",
  },
];

export default function OwnerDashboardPage() {
  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Owner Shell
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
          Dark Labs Command Center
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          This will become the private operating layer for clients, projects,
          tasks, goals, notes, and future automation.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30"
            >
              <p className="text-sm text-white/45">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                {card.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
          <h2 className="text-lg font-semibold">Next engineering milestone</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Wire Google authentication, owner email authorization, workspace
            bootstrap, and server-side route protection.
          </p>
        </div>
      </div>
    </section>
  );
}
