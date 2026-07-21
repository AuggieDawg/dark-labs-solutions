export const dynamic = "force-dynamic";

import Link from "next/link";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { APP_CONFIG } from "@/config/app";
import { requireOwner } from "@/lib/auth/require";

const ownerLinks = [
  { label: "Dashboard", href: "/owner" },
  { label: "Clients", href: "/owner/clients" },
  { label: "Projects", href: "/owner/projects" },
  { label: "Tasks", href: "/owner/tasks" },
  { label: "Goals", href: "/owner/goals" },
  { label: "Notes", href: "/owner/notes" },
];

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await requireOwner();

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-black/50 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            {APP_CONFIG.companyName}
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Command Center
          </h1>
        </Link>

        <nav className="mt-10 space-y-2 text-sm">
          {ownerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-white/65 transition hover:bg-white/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-2 border-t border-white/10 pt-6 text-sm">
          <Link
            href="/work"
            className="rounded-xl px-4 py-3 text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            View Public Work ↗
          </Link>
          <Link
            href="/"
            className="rounded-xl px-4 py-3 text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            View Public Site ↗
          </Link>
        </div>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs text-white/40">Signed in as</p>
          <p className="mt-1 truncate text-sm font-medium text-white/80">
            {owner.email}
          </p>
          <p className="mt-3 text-xs text-white/35">
            Workspace: {owner.workspaceSlug}
          </p>
          <SignOutButton />
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/owner" className="font-semibold">
              {APP_CONFIG.ownerAppName}
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/work" className="text-sm text-white/60">
                Work
              </Link>
              <Link href="/" className="text-sm text-white/60">
                Site
              </Link>
            </div>
          </div>

          <nav
            aria-label="Command Center navigation"
            className="flex gap-2 overflow-x-auto px-5 pb-4"
          >
            {ownerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.09] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {children}
      </main>
    </div>
  );
}
