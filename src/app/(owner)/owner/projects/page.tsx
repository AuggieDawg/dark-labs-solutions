export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
};

export default function OwnerProjectsPage() {
  return (
    <section className="px-5 py-8 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
        Owner Only
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
        This will track client projects, internal builds, milestones,
        deliverables, project updates, and owner-only notes.
      </p>
    </section>
  );
}
