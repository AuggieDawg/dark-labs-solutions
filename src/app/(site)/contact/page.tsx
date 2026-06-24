export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className="bg-black px-6 py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Contact
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Start with the system you actually need.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            The contact flow will eventually connect into the client pipeline
            inside the Dark Labs Command Center.
          </p>
        </div>

        <form className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Name
              </span>
              <input
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                placeholder="Your name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Email
              </span>
              <input
                type="email"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Project
              </span>
              <textarea
                className="min-h-36 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                placeholder="Tell me what you want to build."
              />
            </label>

            <button
              type="button"
              className="mt-2 h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Intake automation coming next
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
