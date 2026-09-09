"use client";

import { lazy, Suspense } from "react";

import { cn } from "@/lib/utils";

const Spline = lazy(() => import("@splinetool/react-spline"));

type SplineSceneProps = {
  scene: string;
  className?: string;
};

/**
 * Thin wrapper around `@splinetool/react-spline`'s default export, lazily
 * loaded so the Spline runtime itself is only fetched once this component
 * actually renders — the caller (`HeroScene`) is what decides *whether* it
 * ever renders at all.
 *
 * The supplied version's fallback referenced a `.loader` class that does not
 * exist anywhere in `app/globals.css`, so it rendered nothing while the
 * runtime downloaded. This fallback is built from tokens already in the
 * system instead: a pulsing panel the same shape the scene will fill, so the
 * hero's object column never shows a blank hole mid-load.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-hidden="true"
          className={cn(
            "animate-pulse rounded-2xl border border-border bg-card/40",
            className,
          )}
        />
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
