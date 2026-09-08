"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

import type { Locale } from "@/content/i18n";

const Scene = dynamic(
  () => import("./architecture-scene").then((m) => m.ArchitectureScene),
  { ssr: false },
);

/** Below this width no WebGL loads at all. */
const MIN_WIDTH = 768;

/**
 * Every guard CLAUDE.md requires, in one place.
 *
 * The scene is never fetched at all on a phone or under reduced motion — the
 * gate is a state check before the dynamic import resolves, not CSS hiding a
 * canvas that already downloaded three.js. That is also what protects the
 * mobile Lighthouse budget: the phone never pays for this.
 *
 * Task 10b mounts this once, at the page level, as a fixed layer that persists
 * down the page instead of a hero object that exits on scroll — see
 * `ArchitectureScene` for the per-section choreography and the perf budget
 * that comes with a layer that can no longer rely on an off-screen pause.
 */
export function Architecture({ locale }: { locale: Locale }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(wide.matches && !still.matches);
    update();

    wide.addEventListener("change", update);
    still.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      still.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <Scene locale={locale} />
    </Suspense>
  );
}
