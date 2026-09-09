"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => m.SplineScene),
  { ssr: false },
);

/** Below this width no WebGL loads at all — Tailwind's `lg`, matching the
 *  two-column hero grid whose right track this layer parks over. */
const MIN_WIDTH = 1024;

/**
 * TODO before launch: this is Spline's own public sample scene — a stock
 * isometric robot that appears on many other sites, wired here only so the
 * integration is testable end to end. CLAUDE.md bans isometric robots by
 * name, and pinning it to the viewport means it is now on screen for the
 * whole scroll rather than just the hero, which makes replacing it more
 * urgent, not less. Replace with a scene built for RTECH INDO before ship.
 */
const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * The Spline scene as a viewport-fixed layer.
 *
 * Task 10e had this mounted inside `Billboard`'s right column, so it scrolled
 * away with the hero. The client asked for the object to hold its position
 * for the entire page instead, so it now mounts once at the page level and
 * never moves. `fixed inset-0` with the same `max-w-[1400px]` container and
 * horizontal padding the sections use, so the scene box lands on the hero's
 * `440px` right track and stays column-aligned with the content underneath
 * it at every breakpoint.
 *
 * ## Stacking
 *
 * `z-40`: above page content, below `SiteNav`'s `z-50`. In front rather than
 * behind on purpose — the hero poster is a full-bleed opaque image, so a
 * layer stacked underneath the content would be invisible for the whole
 * first screen, which is the one place the object most needs to read. This
 * also settles the feedback Task 10c recorded, that the object at `-z-10`
 * read as "not clearly shown". Nothing else on the page needs a z-index for
 * this to work: one fixed layer, one number, no per-card surgery.
 *
 * ## Edges
 *
 * No frame. The scene box carries no border, no radius and no `overflow`
 * clip — `scene-feather` (app/globals.css) masks its edges into the page
 * instead, so the object dissolves rather than being cut off. That mask also
 * replaces the clipping `overflow-hidden` used to do: it contains the
 * `Spotlight` glow, which is absolutely positioned and would otherwise spill
 * out of the lane now that nothing crops it.
 *
 * Pointer events are split. The full-viewport wrapper is
 * `pointer-events-none` — it covers everything, so if it took clicks it would
 * swallow the rail cards and the contact CTA behind it. The scene box itself
 * is `pointer-events-auto`, so the object tracks the cursor and responds the
 * way Spline built it to. That is only safe because the box now sits in a
 * reserved lane with no content underneath it, and because it drops back to
 * `pointer-events-none` the moment it fades out of zone — an invisible layer
 * must never be a click target.
 *
 * ## Where it is visible
 *
 * The billboard and the capabilities rail, and nowhere else. Those two carry
 * `data-scene-zone`; this component watches them and fades the object out
 * once neither is on screen. The lane follows the same rule — only those two
 * sections reserve it (`Rail`'s `sceneZone`, and the hero grid) — so every
 * section below takes the full measure back rather than holding an empty
 * column for an object that is no longer there.
 *
 * ## Guards
 *
 * Unchanged from the hero-column version, and they run *before* the dynamic
 * import is requested, not as CSS over a canvas that already downloaded: a
 * phone, and anyone under `prefers-reduced-motion: reduce`, never fetches the
 * Spline runtime at all. The billboard poster stays the LCP element — this
 * layer never carries `priority` and never renders on the server.
 *
 * A fixed layer cannot fall back on an off-screen pause the way a hero object
 * could, so this is continuous WebGL for the whole scroll. The `lg` gate is
 * what contains that: the mobile budget never pays for it. See MOTION.md.
 */
export function FixedScene() {
  const [enabled, setEnabled] = useState(false);
  // Starts hidden, not shown. If the observer never reports — the tab is
  // suspended, the API is missing, the zones are gone — the failure that
  // costs least is no object at all. Defaulting to visible would leave it
  // hanging over the sections below, which no longer reserve a lane for it.
  // The correcting callback lands on the first frame after mount, long before
  // the Spline runtime has finished booting, so nothing is perceptibly late.
  const [inZone, setInZone] = useState(false);

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

  // Which sections the scene is allowed to be visible over. Declared in the
  // markup (`data-scene-zone`) rather than listed here, so adding or moving a
  // zone is a change to the section that owns it, not to this file.
  //
  // The bottom `rootMargin` is what makes the handover read cleanly. Without
  // it the scene would still be counted "in zone" while the last sliver of
  // the capabilities rail sits at the top of the screen, by which point the
  // next section already fills the view and the object would be hanging over
  // content that no longer reserves a lane for it. Pulling the root's bottom
  // edge up means the fade starts while the zone is still comfortably on
  // screen and has finished before the next section owns the viewport.
  useEffect(() => {
    if (!enabled) return;

    const zones = document.querySelectorAll("[data-scene-zone]");
    if (!zones.length) return;

    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target);
          else seen.delete(entry.target);
        }
        setInZone(seen.size > 0);
      },
      { rootMargin: "0px 0px -35% 0px" },
    );

    for (const zone of zones) io.observe(zone);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      // The wrapper spans the viewport, so it must never take a click — only
      // the scene box itself does, below.
      className="pointer-events-none fixed inset-0 z-40 hidden lg:block"
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-end px-3 md:px-6">
        {/* Sized from the same custom properties every container reserves
            its lane from (see `--scene-w` in app/globals.css), so the object
            and the space kept clear for it are one value, not two that have
            to be remembered together. */}
        <div
          className={cn(
            "scene-feather pointer-events-auto relative h-[var(--scene-h)] w-[var(--scene-w)]",
            "transition-opacity duration-500 ease-out",
            inZone ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Spotlight className="-top-1/4 left-1/2" size={320} />
          <Suspense fallback={null}>
            <SplineScene scene={SCENE_URL} className="h-full w-full" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
