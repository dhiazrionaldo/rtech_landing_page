/**
 * Shared motion plumbing.
 *
 * GSAP and ScrollTrigger are imported dynamically rather than at module scope,
 * so they land in a chunk that is only fetched once a motion component mounts.
 * CLAUDE.md gives the page a mobile performance budget of 90 and an LCP under
 * 2.5s; a ~70 KB animation library in the initial bundle is not how that budget
 * gets spent, especially when nothing above the fold animates.
 *
 * Every entry point here returns `null` under `prefers-reduced-motion: reduce`
 * and never fetches the library at all in that case. That is the rule from
 * CLAUDE.md — reduced motion collapses scroll work to nothing, and the cheapest
 * way to guarantee it is to make the code path unreachable.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type GsapLib = typeof import("gsap")["gsap"];

let scrollTriggerReady: Promise<GsapLib | null> | undefined;

/**
 * Resolves with a GSAP instance that has ScrollTrigger registered, or `null` if
 * motion is off. Memoised, so ten components mounting cost one import.
 */
export function registerScrollTrigger(): Promise<GsapLib | null> {
  if (prefersReducedMotion()) return Promise.resolve(null);

  scrollTriggerReady ??= (async () => {
    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      // ScrollTrigger caches element positions. Anything that changes layout
      // after those measurements — a late webfont, an image decoding, a
      // <details> opening — leaves every trigger firing at the wrong scroll
      // position. Refreshing on font load covers the one that always bites.
      if (document.fonts?.status !== "loaded") {
        void document.fonts?.ready.then(() => ScrollTrigger.refresh());
      }

      return gsap;
    } catch {
      // A failed chunk must never leave content stuck in its hidden state.
      // Callers treat null as "show everything now".
      return null;
    }
  })();

  return scrollTriggerReady;
}
