export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notes",
};

export default function OwnerNotesPage() {
  return (
    <section className="px-5 py-8 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
        Owner Only
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
        Notes
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
        This will become the private knowledge layer for client notes, project
        decisions, technical notes, prompts, procedures, and lessons learned.
      </p>
    </section>
  );
}
