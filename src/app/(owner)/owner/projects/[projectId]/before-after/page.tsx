import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { formatTimestamp } from "@/lib/utils/format";
import { createProjectBeforeAfterAssetAction } from "@/server/actions/project-before-after";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Before / After",
};

type BeforeAfterPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectBeforeAfterPage({
  params,
}: BeforeAfterPageProps) {
  const owner = await requireOwner();
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: owner.workspaceId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          company: true,
        },
      },
      beforeAfterAssets: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const createAsset = createProjectBeforeAfterAssetAction.bind(
    null,
    project.id,
  );

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href={`/owner/projects/${project.id}`}
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to project
      </Link>

      <div className="mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Before / After
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            Upload before and after screenshots for website redesigns, landing
            page improvements, and client-facing visual proof.
          </p>
        </div>

        <div className="flex gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1">
          <Link
            href={`/owner/projects/${project.id}`}
            className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50 hover:text-white"
          >
            Overview
          </Link>
          <Link
            href={`/owner/projects/${project.id}/before-after`}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black"
          >
            Before / After
          </Link>
        </div>
      </div>

      <form
        action={createAsset}
        className="mt-10 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Label
            </span>
            <input
              name="label"
              placeholder="Homepage redesign, service page, landing page..."
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Notes
            </span>
            <input
              name="notes"
              placeholder="What changed?"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Before image
            </span>
            <input
              name="beforeImage"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              After image
            </span>
            <input
              name="afterImage"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Upload Before / After
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-6">
        {project.beforeAfterAssets.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8">
            <p className="text-lg font-semibold">
              No before/after uploads yet.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Upload screenshots to document transformation work for this
              project.
            </p>
          </div>
        ) : (
          project.beforeAfterAssets.map((asset) => (
            <article
              key={asset.id}
              className="rounded-3xl border border-white/10 bg-white/[0.025] p-5"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <h2 className="text-xl font-semibold">
                    {asset.label || "Before / After"}
                  </h2>
                  <p className="mt-2 text-sm text-white/45">
                    {asset.notes || "No notes added."}
                  </p>
                </div>
                <p className="text-xs text-white/35">
                  Uploaded {formatTimestamp(asset.createdAt)}
                </p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                    Before
                  </p>
                  {asset.beforeImageUrl ? (
                    <Image
                      src={asset.beforeImageUrl}
                      alt={`${asset.label || project.name} before`}
                      width={1400}
                      height={900}
                      className="h-auto w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="grid aspect-video place-items-center rounded-2xl border border-white/10 text-sm text-white/35">
                      No before image
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/40 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                    After
                  </p>
                  {asset.afterImageUrl ? (
                    <Image
                      src={asset.afterImageUrl}
                      alt={`${asset.label || project.name} after`}
                      width={1400}
                      height={900}
                      className="h-auto w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="grid aspect-video place-items-center rounded-2xl border border-white/10 text-sm text-white/35">
                      No after image
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
