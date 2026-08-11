"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { registerScrollTrigger } from "@/lib/motion";

/**
 * The hairline above the four project stages, drawn left to right as you scroll
 * through the section.
 *
 * This is the one scrubbed animation on the page — its progress is tied to
 * scroll position rather than played on a timer. That is deliberate and it is
 * the only place it belongs: the rail represents a run of work with a direction,
 * so tying how much of it is drawn to how far down the section you are says
 * something true. Scrubbing decorative elements is how a page starts feeling
 * like it is animating at you rather than with you.
 *
 * `scaleX` from a left origin, so the only property changing is a transform on
 * a 1px element. No layout, no paint of anything else, no CLS.
 *
 * With reduced motion or without JavaScript the rail is simply drawn — the CSS
 * start state lives under `.js`, so a non-JS visitor never sees a blank rail.
 */
export function ScrubRail({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The section is the trigger, not the 1px rail itself: a zero-height
    // element at the top of the section would finish before it started.
    const section = el.closest("section");
    if (!section) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    void registerScrollTrigger().then((gsap) => {
      if (cancelled) return;
      if (!gsap) {
        el.removeAttribute("data-rail");
        return;
      }

      ctx = gsap.context(() => {
        gsap.to(el, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            // Starts as the section's top reaches three-quarters down the
            // viewport and completes by the time its midpoint is centred, so
            // the rail is fully drawn well before the last card is read.
            start: "top 75%",
            end: "center center",
            scrub: 0.6,
          },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-rail=""
      className={cn("block h-px w-full origin-left bg-border", className)}
    />
  );
}
