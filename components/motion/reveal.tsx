"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { registerScrollTrigger } from "@/lib/motion";

/**
 * Fades and lifts its children into view once, on first scroll past.
 *
 * A client component that takes server-rendered `children`. Nothing inside it
 * becomes a client component — the copy, the cards, and the links are all still
 * rendered on the server and present in the initial HTML. This wrapper only
 * attaches behaviour to DOM that already exists.
 *
 * How the initial hidden state is set matters more than the animation. Setting
 * `opacity: 0` from JavaScript means the server HTML paints visible and then
 * blinks out when hydration lands. Instead the start state lives in globals.css
 * under `.js`, a class the inline head script adds before first paint — so the
 * element is hidden from the very first frame for anyone running JavaScript,
 * and permanently visible for anyone who is not. Only `opacity` and `transform`
 * are touched, neither of which affects layout, so this cannot move anything on
 * the page and cannot cost CLS.
 *
 * `once: true` — content does not re-hide when you scroll back up. Sections
 * that replay on every pass are what make a page tiring to use.
 */
export function Reveal({
  as: Tag = "div",
  children,
  stagger = 0.07,
  y = 20,
  start = "top 86%",
  className,
}: {
  /** The element this renders as. Staggering targets its direct children, so
   *  this usually needs to BE the grid or list rather than wrap one — an extra
   *  <div> around a <dl> leaves the stagger with exactly one thing to stagger. */
  as?: "div" | "dl" | "ul" | "ol";
  children: React.ReactNode;
  /** Seconds between each direct child. 0 animates the block as one piece. */
  stagger?: number;
  /** Distance in px the block rises through. */
  y?: number;
  /** ScrollTrigger start, in its own syntax: "<trigger edge> <viewport edge>". */
  start?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const targets = stagger
      ? Array.from(el.children).filter((n) => n instanceof HTMLElement)
      : [el];

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    const show = () => {
      el.removeAttribute("data-reveal");
      el.removeAttribute("data-reveal-group");
    };

    void registerScrollTrigger().then((gsap) => {
      if (cancelled) return;

      // Reduced motion, or the chunk failed to load. Either way the content has
      // to end up visible — never leave it in the CSS start state.
      if (!gsap || targets.length === 0) {
        show();
        return;
      }

      // Every tween and trigger created inside the context reverts together on
      // unmount, as CLAUDE.md requires.
      ctx = gsap.context(() => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [stagger, start]);

  return (
    <Tag
      ref={root as React.Ref<never>}
      // These attributes drive the CSS start state: on the element itself when
      // the block moves as one piece, on its direct children when it staggers.
      {...(stagger ? { "data-reveal-group": "" } : { "data-reveal": "" })}
      style={{ "--reveal-y": `${y}px` } as React.CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
