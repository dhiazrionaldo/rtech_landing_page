"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { resolveToken } from "@/lib/token-color";

/**
 * The scroll-driven node field.
 *
 * ## Why this exists despite CLAUDE.md banning it
 *
 * CLAUDE.md's banned list, item 2, is "particle fields of connected nodes and
 * edges standing in for 'a neural network'". This component is exactly that.
 *
 * It was requested explicitly, and the ban was raised and overridden by the
 * client on 2026-08-18 after the conflict was put to them directly. This note
 * exists so the next person reads it as a decision rather than as an oversight
 * and does not "fix" it back out. If the rule is ever reinstated, the honest
 * replacement is a labelled pipe run drawn from the Water Line Piping product
 * — same nodes-and-edges geometry, real equipment at the vertices.
 *
 * ## Why canvas 2D and not three.js
 *
 * The reference is a persistent object that transforms across the scroll, not a
 * lit 3D scene. Nothing here needs materials, shadows, or a depth buffer — the
 * nodes are projected by hand, which is about fifteen lines of arithmetic. That
 * keeps `three` (~150 KB gzipped) out of the bundle entirely for a component
 * that would only have used its projection matrix.
 *
 * ## Budget
 *
 * - `dpr` capped at 1.5, per CLAUDE.md.
 * - No WebGL, no `<Canvas>`, so nothing to `dynamic()`-import for SSR safety —
 *   but the canvas still never paints on the server and is never the LCP
 *   element: it renders behind the copy and starts transparent.
 * - The rAF loop is stopped by IntersectionObserver when off-screen and by
 *   `visibilitychange` when the tab is hidden. A background tab costs nothing.
 * - `prefers-reduced-motion: reduce` paints exactly one static frame and never
 *   starts the loop.
 * - Below 768px the field renders at a lower node count and does not rotate,
 *   per the "no WebGL on mobile by default" spirit of the rule — this is
 *   cheaper than WebGL but a phone still should not run a 60fps particle sim.
 *
 * ## Colour
 *
 * Every colour is read out of the theme at mount and re-read on theme change,
 * so the field recolours with the toggle and no hex ever appears here. The
 * ramp is the teal `--chart-*` scale (data), and `--primary` marks the single
 * node that stands for something needing action — the orange/teal relationship
 * CLAUDE.md calls the palette's real asset.
 */

type Node = {
  x: number;
  y: number;
  z: number;
  /** Small per-node drift so the field is never perfectly static. */
  dx: number;
  dy: number;
  /** True for the one node rendered in `--primary`. */
  accent: boolean;
};

const DESKTOP_NODES = 130;
const MOBILE_NODES = 40;
/**
 * Squared 3D distance below which two nodes are joined.
 *
 * Density comes from node count, not from reach. Raising this to 0.78 was the
 * first attempt at "more visible" and it was wrong: long links produced huge
 * triangles spanning half the viewport, which crossed the headline and read as
 * clutter rather than as structure. Short links over a denser field give a
 * lattice, which is what actually looks like a network.
 */
const LINK_DISTANCE = 0.36;

export function NodeField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");

    let nodes: Node[] = [];
    let palette: [number, number, number][] = [];
    let accentColor: [number, number, number] = [255, 138, 0];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    /** 0 at the top of the document, 1 at the bottom. */
    let scrollProgress = 0;

    /**
     * Scene state, blended from the `[data-field-scene]` elements each frame.
     * `sceneX` is a fraction of viewport width, so positive pushes the field
     * right and the copy reads left of it.
     */
    let sceneX = 0;
    let sceneZoom = 1;
    let scenes: HTMLElement[] = [];

    function readPalette() {
      palette = ["--chart-2", "--chart-3", "--chart-4", "--chart-5"].map(
        resolveToken,
      );
      accentColor = resolveToken("--primary");
    }

    function seed() {
      const count = mobile.matches ? MOBILE_NODES : DESKTOP_NODES;
      nodes = Array.from({ length: count }, (_, i) => ({
        // Rejection-free spherical-ish distribution: cube sampling reads as a
        // box when it rotates, so the radius is pulled toward the centre.
        x: (Math.random() * 2 - 1) * 1.15,
        y: (Math.random() * 2 - 1) * 1.15,
        z: (Math.random() * 2 - 1) * 1.15,
        dx: (Math.random() - 0.5) * 0.0006,
        dy: (Math.random() - 0.5) * 0.0006,
        accent: i === 0,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function readScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    }

    /**
     * Blends every scene by how near its centre is to the middle of the
     * viewport, rather than switching between them at hard boundaries.
     *
     * Boundaries were the first attempt and they are wrong for this: the field
     * snapped the instant a section's edge crossed the fold, which reads as a
     * cut. Weighting by distance and squaring the weight means the nearest
     * scene dominates while the next one is already pulling, so the object
     * travels continuously between marks — which is what the reference does.
     *
     * Weights fall off linearly over one viewport height and are then squared,
     * so a scene two viewports away contributes nothing at all.
     */
    function readScenes() {
      if (scenes.length === 0) {
        sceneX = 0;
        sceneZoom = 1 + scrollProgress * 0.85;
        return;
      }

      const middle = window.innerHeight / 2;
      // Mobile gets a quarter of the lateral travel. The full swing on a narrow
      // screen throws most of the field off the side of the display.
      const lateral = mobile.matches ? 0.25 : 1;

      let total = 0;
      let x = 0;
      let z = 0;

      for (const el of scenes) {
        const rect = el.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        const distance = Math.abs(centre - middle) / window.innerHeight;
        const weight = Math.max(0, 1 - distance) ** 2;
        if (weight === 0) continue;

        total += weight;
        x += weight * Number(el.dataset.fieldX ?? 0);
        z += weight * Number(el.dataset.fieldZoom ?? 1);
      }

      // Between two scenes that are both more than a viewport away — the footer,
      // mostly — hold the last pose rather than snapping back to the origin.
      if (total === 0) return;

      sceneX = (x / total) * lateral;
      sceneZoom = z / total;
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);

      // Scroll drives the camera, which is the whole point: the field is one
      // object that travels rather than a loop playing underneath the page.
      // Zoom pushes in, and the field turns roughly a third of a revolution
      // top to bottom.
      const spin = mobile.matches ? 0 : time * 0.00004;
      const angle = scrollProgress * Math.PI * 0.7 + spin;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Zoom and lateral position come from the blended scenes, so each section
      // gets its own framing of the same object.
      const scale = Math.min(width, height) * 0.42 * sceneZoom;
      const cx = width / 2 + sceneX * width;
      const cy = height / 2;

      // Project once, reuse for both passes. Edges are drawn first so nodes
      // always sit on top of their own connections.
      const projected = nodes.map((n) => {
        const rx = n.x * cos - n.z * sin;
        const rz = n.x * sin + n.z * cos;
        // Perspective divide. The 2.6 is the camera distance; smaller values
        // exaggerate the depth and make the field read as a funnel.
        const depth = 1 / (2.6 - rz);
        return {
          sx: cx + rx * scale * depth * 2.6,
          sy: cy + n.y * scale * depth * 2.6,
          depth,
          rz,
          accent: n.accent,
        };
      });

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d =
            (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
          if (d > LINK_DISTANCE) continue;

          const pa = projected[i];
          const pb = projected[j];
          // Nearer links are brighter, which is what stops the field reading
          // as a flat tangle of equal-weight lines.
          const strength = (1 - d / LINK_DISTANCE) * 0.8;
          const fade = Math.max(0, Math.min(1, (pa.depth + pb.depth) * 1.1));
          const [r, g, bl] = palette[(i + j) % palette.length];
          ctx!.strokeStyle = `rgba(${r},${g},${bl},${strength * fade * 1.5})`;
          ctx!.lineWidth = 0.9;
          ctx!.beginPath();
          ctx!.moveTo(pa.sx, pa.sy);
          ctx!.lineTo(pb.sx, pb.sy);
          ctx!.stroke();
        }
      }

      projected.forEach((p, i) => {
        const [r, g, bl] = p.accent ? accentColor : palette[i % palette.length];
        const radius = Math.max(1.2, p.depth * 4.6);
        const alpha = Math.max(0.42, Math.min(1, p.depth * 3.1));
        ctx!.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx!.fill();

        if (p.accent) {
          // The one node that means "this needs attention" gets a halo so it
          // is findable in a field of ninety.
          ctx!.strokeStyle = `rgba(${r},${g},${bl},${alpha * 0.5})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(p.sx, p.sy, radius + 5, 0, Math.PI * 2);
          ctx!.stroke();
        }
      });
    }

    function tick(time: number) {
      if (!running) return;
      readScenes();
      for (const n of nodes) {
        n.x += n.dx;
        n.y += n.dy;
        if (Math.abs(n.x) > 1.2) n.dx *= -1;
        if (Math.abs(n.y) > 1.2) n.dy *= -1;
      }
      draw(time);
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (running || reduced.matches) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    readPalette();
    seed();
    resize();
    scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-field-scene]"),
    );
    readScroll();
    readScenes();
    draw(0);

    if (reduced.matches) {
      // One frame, then nothing. Scroll still repositions it, so the field is
      // not simply frozen — it just never animates on its own.
      const onScrollStatic = () => {
        readScroll();
        readScenes();
        draw(0);
      };
      window.addEventListener("scroll", onScrollStatic, { passive: true });
      return () => window.removeEventListener("scroll", onScrollStatic);
    }

    const onScroll = () => readScroll();
    const onResize = () => {
      resize();
      seed();
      readScenes();
      draw(0);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    // The theme toggle swaps the tokens under us; re-read rather than reload.
    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("size-full", className)}
    />
  );
}
