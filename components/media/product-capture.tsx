"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A product's screen recording, sitting at the head of its card.
 *
 * These are real captures of systems running — the thing CLAUDE.md asks for
 * over cinematic footage — and they are correspondingly heavy: 2.7 MB, 5.5 MB
 * and 11.5 MB. Well past the 2 MB autoplay budget, so none of them autoplay.
 * The card shows a still and the viewer decides.
 *
 * The still is the recording's own first second, not a separate poster file.
 * With `preload="metadata"` and a `#t=` media fragment the browser fetches the
 * header and one frame — all three files are faststart, so that is a small
 * range request off the front, not the whole clip. It also means the thumbnail
 * cannot drift out of sync with the footage, and there is no invented artwork
 * standing in for a client system.
 *
 * Sequence: nothing on the wire → in view, fetch metadata and paint the frame →
 * clicked, fetch and play. Paused again the moment it scrolls away.
 *
 * Starts muted even though the click is a user gesture. Two of the three
 * recordings carry an audio track and a card that starts talking when you tap
 * it is hostile; `controls` puts unmuting one click away.
 */
export function ProductCapture({
  src,
  seconds,
  name,
  captureLabel,
  playLabel,
  className,
}: {
  src: string;
  seconds: number;
  name: string;
  captureLabel: string;
  playLabel: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState(false);

  // Arm slightly before the card is on screen so the frame is already painted
  // by the time it arrives, rather than popping in under the viewer.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = videoRef.current;
    if (!el) return;

    // Runs after the element has re-rendered with its source, so the play call
    // always has media to act on. Rejection is a normal outcome, not an error.
    void el.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause();
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={frameRef}
      /* `dark` because the surface behind this is footage, not the page. Tokens
         still resolve — to their dark values, which is what reads over video in
         either theme — so nothing here needs a literal colour. */
      className={cn(
        "dark group/frame relative aspect-video w-full overflow-hidden bg-background",
        className,
      )}
    >
      <video
        ref={videoRef}
        // Deliberately not `src` until armed: an unarmed <video> touches the
        // network for nothing.
        src={armed || active ? `${src}#t=0.6` : undefined}
        preload={active ? "auto" : "metadata"}
        controls={active}
        controlsList="nodownload"
        playsInline
        muted
        // Until it is playing it is a thumbnail, and the button over it carries
        // the accessible name. Once it has controls it needs its own.
        tabIndex={active ? undefined : -1}
        aria-hidden={active ? undefined : true}
        aria-label={active ? `${captureLabel}: ${name}` : undefined}
        className="size-full object-cover object-center"
      />

      {active ? null : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className={cn(
            "absolute inset-0 flex items-end",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <span className="sr-only">
            {playLabel}: {name}
          </span>

          {/* Scrim, not a flat wash — a uniform overlay dulls the whole frame. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/40 to-transparent"
          />

          {/* Reads as an instrument strip along the bottom of the frame rather
              than a play button floating in the middle of it. */}
          <span
            aria-hidden="true"
            className="relative flex w-full items-center gap-3 px-4 py-3.5"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-sm border border-border bg-background/50 text-foreground transition-colors group-hover/frame:border-foreground/50">
              <svg viewBox="0 0 10 10" className="size-2.5" fill="currentColor">
                <path d="M2 0.6 9 5 2 9.4Z" />
              </svg>
            </span>
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {captureLabel}
            </span>
            <span className="ml-auto font-mono text-[0.6875rem] tabular-nums text-metric">
              {formatDuration(seconds)}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/** Durations come from the MP4 headers, so this only has to format them. */
function formatDuration(seconds: number) {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
