"use client";

import { useEffect } from "react";

import { prefersReducedMotion, registerScrollTrigger } from "@/lib/motion";

/**
 * Lenis smooth scrolling, mounted once for the page.
 *
 * Renders nothing. It lives in the layout only because scrolling is a
 * document-level concern; no markup depends on it, and with JavaScript off the
 * page scrolls natively and everything still works.
 *
 * The wiring between Lenis and ScrollTrigger is the part that has to be right.
 * Lenis moves the page on its own rAF loop instead of the browser's native
 * scroll, so ScrollTrigger stops being told when the position changed and every
 * trigger fires late or not at all. Three lines fix it: drive ScrollTrigger's
 * update from Lenis's scroll event, drive Lenis's raf from GSAP's ticker so
 * there is one clock rather than two competing ones, and turn off GSAP's own
 * lag smoothing, which would otherwise drop frames Lenis needs.
 *
 * Off entirely under `prefers-reduced-motion: reduce`. Hijacking the scroll
 * wheel is exactly the kind of motion that setting exists to refuse, and it is
 * a vestibular trigger for some people, not a preference.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis: import("lenis").default | undefined;
    let gsapLib: Awaited<ReturnType<typeof registerScrollTrigger>>;
    let onScroll: (() => void) | undefined;
    let raf: ((time: number) => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: Lenis }, gsap] = await Promise.all([
        import("lenis"),
        registerScrollTrigger(),
      ]);
      if (cancelled || !gsap) return;

      gsapLib = gsap;
      lenis = new Lenis({
        // Short enough that the page still feels like it answers the wheel.
        // Anything above ~1s reads as the site fighting you.
        duration: 0.9,
        smoothWheel: true,
        // Never on touch: mobile browsers already have momentum scrolling, and
        // overriding it is how a page ends up feeling broken on a phone.
        syncTouch: false,
      });

      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      if (raf && gsapLib) {
        gsapLib.ticker.remove(raf);
        gsapLib.ticker.lagSmoothing(500, 33);
      }
      lenis?.destroy();
    };
  }, []);

  return null;
}
