"use client";

import Image from "next/image";
import { useId, useState } from "react";

export type CaseFileAsset = {
  id: string;
  label: string | null;
  notes: string | null;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
};

type CaseFileViewerProps = {
  projectTitle: string;
  assets: CaseFileAsset[];
  sectionId: string;
};

function frameName(asset: CaseFileAsset, index: number) {
  return asset.label?.trim() || `Frame ${String(index + 1).padStart(2, "0")}`;
}

export function CaseFileViewer({
  projectTitle,
  assets,
  sectionId,
}: CaseFileViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const panelId = useId();
  const activeIndex = Math.min(selectedIndex, Math.max(assets.length - 1, 0));
  const activeAsset = assets[activeIndex];

  if (!activeAsset) {
    return null;
  }

  const activeLabel = frameName(activeAsset, activeIndex);
  const hasBeforeAndAfter = Boolean(
    activeAsset.beforeImageUrl && activeAsset.afterImageUrl,
  );

  return (
    <section
      id={sectionId}
      aria-labelledby={`${panelId}-heading`}
      className="mt-16 scroll-mt-28"
    >
      <div className="flex flex-col justify-between gap-4 border-y border-white/10 py-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
            Public visual proof
          </p>
          <h3
            id={`${panelId}-heading`}
            className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white/88"
          >
            Evidence presented one frame at a time.
          </h3>
        </div>
        <p className="max-w-md text-sm leading-6 text-white/60">
          Only media explicitly marked public in the Command Center is available
          in this viewer.
        </p>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.4fr_1.6fr]">
        <div className="overflow-x-auto pb-2 xl:overflow-visible xl:pb-0">
          <ol
            aria-label={`Visual proof frames for ${projectTitle}`}
            className="flex min-w-max gap-2 xl:min-w-0 xl:flex-col"
          >
            {assets.map((asset, index) => {
              const isActive = index === activeIndex;
              const label = frameName(asset, index);

              return (
                <li key={asset.id} className="min-w-52 xl:min-w-0">
                  <button
                    type="button"
                    aria-controls={panelId}
                    aria-pressed={isActive}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex min-h-14 w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      isActive
                        ? "border-white/24 bg-white/[0.09] text-white"
                        : "border-white/10 bg-white/[0.025] text-white/52 hover:bg-white/[0.055] hover:text-white/78"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs tracking-[0.16em] text-white/42"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/52">
                Frame {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(assets.length).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm font-semibold text-white/74">
                {activeLabel}
              </p>
            </div>

            {assets.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  aria-label={`Show the previous proof frame for ${projectTitle}`}
                  onClick={() =>
                    setSelectedIndex((current) => Math.max(0, current - 1))
                  }
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={activeIndex === assets.length - 1}
                  aria-label={`Show the next proof frame for ${projectTitle}`}
                  onClick={() =>
                    setSelectedIndex((current) =>
                      Math.min(assets.length - 1, current + 1),
                    )
                  }
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>
              </div>
            ) : null}
          </div>

          <figure
            key={activeAsset.id}
            id={panelId}
            aria-live="polite"
            className="case-file-frame"
          >
            <div
              className={`grid gap-px bg-white/10 ${
                hasBeforeAndAfter ? "lg:grid-cols-2" : ""
              }`}
            >
              {activeAsset.beforeImageUrl ? (
                <div className="relative aspect-[16/10] bg-black">
                  <Image
                    src={activeAsset.beforeImageUrl}
                    alt={`${activeLabel}: before view of ${projectTitle}`}
                    fill
                    sizes={
                      hasBeforeAndAfter
                        ? "(min-width: 1280px) 36vw, (min-width: 1024px) 45vw, 100vw"
                        : "(min-width: 1280px) 72vw, 100vw"
                    }
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/72 backdrop-blur">
                    Before
                  </span>
                </div>
              ) : null}

              {activeAsset.afterImageUrl ? (
                <div className="relative aspect-[16/10] bg-black">
                  <Image
                    src={activeAsset.afterImageUrl}
                    alt={`${activeLabel}: after view of ${projectTitle}`}
                    fill
                    sizes={
                      hasBeforeAndAfter
                        ? "(min-width: 1280px) 36vw, (min-width: 1024px) 45vw, 100vw"
                        : "(min-width: 1280px) 72vw, 100vw"
                    }
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/72 backdrop-blur">
                    After
                  </span>
                </div>
              ) : null}
            </div>

            {activeAsset.notes ? (
              <figcaption className="border-t border-white/10 p-6 text-sm leading-7 text-white/48">
                {activeAsset.notes}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </div>
    </section>
  );
}
