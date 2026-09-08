"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";

import type { Locale } from "@/content/i18n";
import { registerScrollTrigger } from "@/lib/motion";

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
 * The travel is scrubbed, not pinned. Pinning was the expensive and fragile
 * half of the docking billboard this replaces: a pin rewrites the document
 * flow and can strand the layout on a mid-scroll resize. A transform-only
 * scrub cannot.
 */
export function Architecture({ locale }: { locale: Locale }) {
  const [enabled, setEnabled] = useState(false);
  const container = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!enabled) return;
    const el = container.current;
    if (!el) return;

    // The billboard itself is the trigger, not the canvas: the canvas is
    // transformed by this tween, and measuring a moving element is how a
    // trigger ends up chasing its own animation.
    const header = el.closest("header");
    if (!header) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    let onResize: (() => void) | undefined;

    void registerScrollTrigger().then(async (gsap) => {
      if (cancelled || !gsap) return;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.to(el, {
          // Right to left, receding, gone before the first rail. Transform and
          // opacity only — nothing here can move the page or add to CLS.
          xPercent: -55,
          scale: 0.75,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: header,
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      }, el);

      // ScrollTrigger caches element positions at creation. The hero is sized
      // in svh, so a window resize changes where this trigger should start and
      // end; the cached measurements have to be dropped.
      onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
    });

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={container} className="size-full will-change-transform">
      <Suspense fallback={null}>
        <Scene locale={locale} />
      </Suspense>
    </div>
  );
}
