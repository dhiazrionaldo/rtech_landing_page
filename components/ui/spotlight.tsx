"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  /** Diameter of the glow, in pixels. */
  size?: number;
  springOptions?: SpringOptions;
};

const DEFAULT_SPRING: SpringOptions = { bounce: 0, damping: 26, stiffness: 260 };

/**
 * A soft radial glow that follows the pointer across whatever element this
 * component's parent is. Adapted from the client-supplied component: it
 * imports from `motion/react` — this project already ships `motion@12.43.0`,
 * the same animation library under its current name, so importing the older
 * package name too would ship a second copy of it — a fixed listener leak
 * (below), and colour that comes from this project's tokens instead of a
 * hardcoded `zinc` ramp.
 *
 * Sits over the hero's object column (the Spline scene), so the glow reads
 * as light cast by the scene rather than by the page — hence the teal ramp,
 * the same instrument colour reserved for data and, previously, the
 * architecture object this task replaces. Never `--primary`: orange stays on
 * the CTA alone.
 */
export function Spotlight({
  className,
  size = 280,
  springOptions = DEFAULT_SPRING,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parent, setParent] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springOptions);
  const springY = useSpring(mouseY, springOptions);
  const translateX = useTransform(springX, (v) => v - size / 2);
  const translateY = useTransform(springY, (v) => v - size / 2);

  // The glow has to track the pointer across the *parent* element (the whole
  // object column), not just this small absolutely-positioned div, so on
  // mount it reaches up one level and makes that parent a positioned,
  // clipped container. That upward reach is how this component works, kept
  // from the supplied version rather than removed — a future caller just
  // needs to know it happens before dropping this somewhere the mutation
  // would be unwelcome.
  useEffect(() => {
    const node = containerRef.current;
    const parentEl = node?.parentElement ?? null;
    if (parentEl) {
      parentEl.style.position = "relative";
      parentEl.style.overflow = "hidden";
    }
    setParent(parentEl);
  }, []);

  useEffect(() => {
    if (!parent) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    };
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    // Named handlers, not the anonymous-function-in, different-anonymous-
    // function-out pair the supplied version shipped — that pair never
    // actually detached, since `removeEventListener` only matches the exact
    // function reference it was given.
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [parent, mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-2xl transition-opacity duration-300",
        "bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_45%,transparent)_0%,transparent_70%)]",
        hovered ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        translateX,
        translateY,
      }}
    />
  );
}
