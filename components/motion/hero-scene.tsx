"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

import { Spotlight } from "@/components/ui/spotlight";

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => m.SplineScene),
  { ssr: false },
);

/** Below this width no WebGL loads at all — Tailwind's `lg`, matching the
 *  two-column hero grid that only appears at `lg` and up. */
const MIN_WIDTH = 1024;

/**
 * TODO before launch: this is Spline's own public sample scene — a stock
 * isometric robot that appears on many other sites, wired here only so the
 * integration is testable end to end. CLAUDE.md bans isometric robots by
 * name. Replace with a scene built for RTECH INDO before this ships. See the
 * Task 10e report for the full note.
 */
const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * The hero's object column, replacing the three.js architecture diagram
 * (Task 10e). Same guard shape the outgoing component used: the gate is a
 * state check that runs *before* the dynamic import of the Spline module is
 * ever requested, not CSS hiding a canvas that already downloaded. A phone,
 * and anyone under `prefers-reduced-motion: reduce`, never fetches the
 * Spline runtime at all.
 *
 * The billboard poster stays the LCP element regardless — this mounts inside
 * the hero's right column, never as a background, and never carries
 * `priority`.
 */
export function HeroScene({ className }: { className?: string }) {
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
    <div className={className}>
      <Spotlight className="-top-1/4 left-1/2" size={320} />
      <Suspense fallback={null}>
        <SplineScene scene={SCENE_URL} className="h-full w-full" />
      </Suspense>
    </div>
  );
}
