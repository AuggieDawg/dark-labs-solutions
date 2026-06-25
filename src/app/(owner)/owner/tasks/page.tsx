export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tasks",
};

export default function OwnerTasksPage() {
  return (
    <section className="px-5 py-8 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
        Owner Only
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
        Tasks
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
        This will become the execution workbench for client work, personal
        goals, dependencies, status, priority, and weekly execution.
      </p>
    </section>
  );
}
