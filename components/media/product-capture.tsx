"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A product's footage, sitting at the head of its card.
 *
 * These files are 2.8, 5.5 and 11.5 MB — far past the 2 MB autoplay budget in
 * CLAUDE.md, so none of them autoplay and none of them preload. The card is a
 * poster image until someone clicks it; the <video> is not in the DOM before
 * that, so `preload` policy never even comes into it and the section costs
 * three WebP thumbnails.
 *
 * The poster is a real frame lifted out of the clip it fronts, not separate
 * artwork, so the still can never misrepresent what playing it shows. It is a
 * static import, which means next/image gets intrinsic dimensions and a blur
 * placeholder — no layout shift when it decodes.
 *
 * Playback starts muted even though the click is a user gesture. Two of the
 * three files carry an audio track and a card that starts talking when you tap
 * it is hostile; `controls` puts unmuting one click away.
 *
 * Nothing here animates on scroll, so `prefers-reduced-motion` needs no special
 * case — the only motion on the page is footage the viewer asked to play.
 */
export function ProductCapture({
  src,
  poster,
  seconds,
  name,
  kindLabel,
  playLabel,
  client,
  clientLabel,
  className,
}: {
  src: string;
  poster: StaticImageData;
  seconds: number;
  name: string;
  kindLabel: string;
  playLabel: string;
  /** Named client this system was built for, when there is one cleared to name. */
  client?: string;
  clientLabel: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = videoRef.current;
    if (!el) return;

    // Runs after the element has mounted, so the play call always has media to
    // act on. A rejected play is a normal outcome, not an error worth raising.
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
      /* `dark` because what sits behind this strip is footage, not the page.
         Tokens still resolve — to their dark values, which is what reads over
         video in either theme — so nothing here needs a literal colour. */
      className={cn(
        "dark group/frame relative aspect-video w-full overflow-hidden bg-background",
        className,
      )}
    >
      {/* alt="" because it is one frame of the clip the button beside it already
          names, sitting directly above the product's heading and blurb. There is
          nothing here a screen reader user is missing. */}
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        fill
        placeholder="blur"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center"
      />

      {/* Client banner across the head of the frame.

          A sibling of the play button rather than a child of it, for two
          reasons: inside the button its text would be swallowed into the
          button's accessible name ("Play: Integrated HSSE System, Project for
          Pertamina"), and out here it stays real content a screen reader and a
          crawler both read. `pointer-events-none` so it never steals the click.

          Hidden while the video plays — it would sit over the footage and over
          the native controls' top edge. */}
      {client && !active ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex p-3.5">
          {/* A solid chip, not a scrim-and-text banner. A gradient was the first
              attempt and it lost: the Fire Truck poster has its own title text
              burned into the frame in red and white, and no fade dark enough to
              beat that leaves the poster worth showing. A chip is legible over
              any frame, and it echoes the play control at the other corner. */}
          <p className="flex items-center gap-2 rounded-md border border-border bg-background/85 px-2.5 py-1.5">
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {clientLabel}
            </span>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-foreground">
              {client}
            </span>
          </p>
        </div>
      ) : null}

      {active ? (
        <video
          ref={videoRef}
          src={src}
          controls
          controlsList="nodownload"
          playsInline
          muted
          preload="auto"
          aria-label={`${kindLabel}: ${name}`}
          className="absolute inset-0 size-full bg-background object-contain object-center"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 flex items-end focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <span className="sr-only">
            {playLabel}: {name}
          </span>

          {/* Scrim, not a flat wash — a uniform overlay dulls the whole frame. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/50 to-transparent"
          />

          {/* Reads as an instrument strip along the bottom of the frame rather
              than a play button floating in the middle of it. */}
          <span
            aria-hidden="true"
            className="relative flex w-full items-center gap-3 px-4 py-3.5"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-sm border border-border bg-background/60 text-foreground transition-colors group-hover/frame:border-foreground/50">
              <svg viewBox="0 0 10 10" className="size-2.5" fill="currentColor">
                <path d="M2 0.6 9 5 2 9.4Z" />
              </svg>
            </span>
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {kindLabel}
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
