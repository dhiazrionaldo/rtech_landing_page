"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Paging buttons for one rail track, addressed by id rather than by ref so the
 * track itself stays a server-rendered element.
 *
 * Always visible on touch. Netflix reveals its arrows on hover, which on a
 * touch device means never — and the bleeding card is a hint, not a control.
 */
export function RailControls({
  trackId,
  labels,
}: {
  trackId: string;
  labels: { prev: string; next: string };
}) {
  function page(direction: 1 | -1) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  const button = cn(
    "grid size-9 place-items-center rounded-full border border-border text-foreground",
    "transition-colors hover:bg-card",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  );

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        aria-label={labels.prev}
        aria-controls={trackId}
        onClick={() => page(-1)}
        className={button}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        aria-label={labels.next}
        aria-controls={trackId}
        onClick={() => page(1)}
        className={button}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
