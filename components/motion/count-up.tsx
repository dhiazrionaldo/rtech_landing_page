"use client";

import { useEffect, useRef } from "react";

import { registerScrollTrigger } from "@/lib/motion";

/**
 * Counts a whole number up to its final value the first time it scrolls into
 * view.
 *
 * Only applied to figures that are genuinely counts — the three sectors, the
 * ten projects. The founding year renders as 2018 and stays there: counting a
 * year up from zero animates a number that was never a quantity, and on a page
 * whose whole argument is "we do not inflate figures", a year spinning like an
 * odometer is the wrong note. See `countUp` on the stat data in copy.ts.
 *
 * The final value is what the server renders, so it is what a crawler reads and
 * what anyone with JavaScript off or reduced motion on sees. The animation only
 * ever replaces text that is already correct — it can never be the only source
 * of the number.
 *
 * `tabular-nums` on the element it lives in keeps every digit the same width,
 * so the counter cannot make the row jitter as it runs.
 */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    void registerScrollTrigger().then((gsap) => {
      if (cancelled || !gsap) return;

      ctx = gsap.context(() => {
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.n));
          },
          // Guarantees the exact final value even if the last frame is dropped
          // or the tween is killed part-way through.
          onComplete: () => {
            el.textContent = String(value);
          },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      if (el) el.textContent = String(value);
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
