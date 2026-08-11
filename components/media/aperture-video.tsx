"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import posterImage from "@/public/AI Machine.png";
import { cn } from "@/lib/utils";

/** The slice of the Network Information API we actually use. */
type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * The hero media.
 *
 * Fit note: `object-contain`, not cover. On a pure black field the letterboxing
 * is literally invisible, so contain costs nothing and buys two things — the
 * subject is never cropped at narrow viewports, and it renders small enough
 * that the fabricated spec text baked into the source asset ("3.2T FLOPS", the
 * node-graph display) is not legible. That is a mitigation, not a fix; the real
 * fix is a render without the screen.
 *
 * Blending note: `aperture-media` sits on the wrapper, not on the children.
 * mix-blend-mode has to apply to the group so the composited poster-and-video
 * screens onto the glow and the black band behind it. Putting it on each child
 * (or adding `isolate` here) would make them blend against each other inside a
 * new stacking context instead, which is the opposite of what we want.
 *
 * Rules this has to satisfy (CLAUDE.md + the video-web-integration skill):
 * - the video is never the LCP element; the poster is, so it is a real
 *   next/image with `priority` rather than the <video poster> attribute
 * - preload="none", played only by IntersectionObserver, paused off-screen
 * - muted + playsInline or iOS Safari refuses to autoplay
 * - prefers-reduced-motion, Save-Data, and 2g all fall back to the poster
 * - decorative, so aria-hidden — the copy describing it lives in the section
 */
export function ApertureVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conn = (navigator as Navigator & { connection?: Connection })
      .connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejected autoplay is a normal outcome, not an error worth surfacing.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("aperture-media", className)}>
      <Image
        src={posterImage}
        alt=""
        aria-hidden="true"
        priority
        fill
        placeholder="blur"
        // Matches the hero's media column: full width until lg, where it
        // becomes the 56% right-hand column. At 100vw the browser was told to
        // fetch a desktop-width source for a slot barely half that wide, which
        // is wasted bytes on the one image that is the LCP element.
        sizes="(min-width: 1024px) 56vw, 100vw"
        className="object-contain object-center"
      />

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={cn(
          "absolute inset-0 size-full object-contain object-center",
          "transition-opacity duration-700 ease-out",
          playing ? "opacity-100" : "opacity-0",
        )}
      >
        {/*
          Single progressive MP4 for now. The WebM, the mobile cut, and a real
          first-frame poster land once ffmpeg is available — see the plan. The
          mobile <source media> entry must be listed before the desktop one.
        */}
        <source src="/video/product_vid_1.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
