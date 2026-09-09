"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { clients } from "@/content/copy";
import { cn } from "@/lib/utils";

/**
 * The shared corridor band.
 *
 * ## Why it is decorative
 *
 * `ImageStreamHero` is `aria-hidden` and non-interactive, so a band adds no
 * links, no text and no tab stops. It is always additive: whatever it shows
 * exists as real text beside it, and nothing here is the only place any
 * information lives.
 *
 * ## What it costs, and what it gives back
 *
 * - **It stops when it is off screen.** An IntersectionObserver flips
 *   `paused`, freezing the corridor as a still rather than unmounting it, so
 *   scrolling back does not restart the loop or refetch anything.
 * - **It is CSS transforms only.** No WebGL, which is what makes it
 *   permissible below 768px where the Spline scene is gated off.
 * - **Nothing loads until it approaches.** Frames are lazy by default.
 *
 * Under `prefers-reduced-motion: reduce` the corridor renders as a frozen
 * still — see the note on `paused` in `ImageStreamHero`.
 */
function StreamBand({
  slides,
  cards = 7,
  className,
}: {
  slides: React.ReactNode[];
  cards?: number;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={className}>
      <ImageStreamHero
        images={[]}
        slides={slides}
        paused={paused}
        cards={cards}
        // Slower and calmer than the component's default. The default pace
        // reads as a showreel; this page is selling reliability to people who
        // have been burned by demos, and a corridor that rushes undercuts
        // that before a word of copy is read.
        speed={26}
        className={cn(
          "h-[200px] w-full rounded-[1.5rem] border border-border bg-card/30",
          "md:h-[260px] lg:h-[300px]",
        )}
      />
    </div>
  );
}

/**
 * The band above "Dipercaya oleh" / "Trusted by": the client marks, moving.
 *
 * This replaced two earlier bands — one over the work rail streaming clips of
 * the systems, one over the industries rail streaming sector cards. Both were
 * removed at the client's request. The encoded loops they used are still in
 * `public/video/stream` and are now unreferenced; delete that directory if
 * they are not coming back.
 *
 * Marks sit on the same `--surface-brand` plate they wear everywhere else on
 * the page, so a full-colour logo has something to be full-colour against at
 * every depth in the corridor, in both themes.
 *
 * The corridor is `aria-hidden`, so it is not where the proof lives. Every
 * client is still named in text in `TrustedBy` itself — a logo is an image,
 * and the claim has to survive an image that fails to load, a screen reader
 * and a crawler.
 */
export function LogoStream({ className }: { className?: string }) {
  const slides = clients.map((client) => (
    <div
      key={client.name}
      className="flex h-full w-full items-center justify-center bg-surface-brand p-[1.6cqw]"
    >
      {client.logo ? (
        <Image
          src={client.logo}
          alt=""
          // Same reasoning as the static marks: one is an SVG the optimiser
          // cannot process and the rest are already small at native size.
          unoptimized
          className="h-auto w-[72%] object-contain"
        />
      ) : (
        <span className="text-balance px-[0.5cqw] text-center font-heading text-[1.4cqw] font-medium leading-tight tracking-[-0.01em] text-neutral-900">
          {client.wordmark}
        </span>
      )}
    </div>
  ));

  return <StreamBand slides={slides} className={className} />;
}
