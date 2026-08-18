"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { resolveToken } from "@/lib/token-color";

/**
 * The hero brain: a side-view brain drawn as a node network, driven by scroll
 * and by the pointer.
 *
 * ## The ban, again
 *
 * CLAUDE.md's banned list includes "wireframe brains" in the same clause as
 * circuit-board motifs and matrix rain. This is that. It was requested directly
 * on 2026-08-18, in the same conversation where the neural-node ban was raised
 * and overridden, and it is recorded here for the same reason as the note in
 * `node-field.tsx`: so the next person reads it as a decision and does not
 * quietly revert it.
 *
 * ## How the shape is made
 *
 * The outline is not a random point cloud — a cloud never reads as a brain, it
 * reads as a blob. The geometry is real SVG path data (a silhouette, a
 * cerebellum, a stem, and four gyri) sampled with `getPointAtLength` on an
 * off-document `<svg>`. Sampling along the path means consecutive points are
 * neighbours, so joining them draws the contour cleanly, and the cross-links
 * between nearby points on *different* paths are what make it read as a network
 * rather than as a line drawing.
 *
 * `getPointAtLength` is the only reason this is a client component that touches
 * the DOM at mount: there is no way to sample a path without a live SVG element.
 *
 * ## Motion
 *
 * - **Scroll** turns it on its vertical axis and drifts it. The progress is
 *   local to the hero, not the document, so the whole rotation happens while the
 *   hero is actually on screen.
 * - **Pointer** does two things: a small parallax on the whole shape, and a
 *   local excitation where nodes within a radius of the cursor brighten and
 *   swell. That is the "interactive" part — it responds continuously rather
 *   than firing a transition on enter.
 *
 * ## Budget
 *
 * Second canvas on the page, so it is deliberately cheap: about 260 points,
 * `dpr` capped at 1.5, and the rAF loop only runs while the hero is on screen
 * (IntersectionObserver) and the tab is visible. Edges are precomputed once at
 * mount rather than distance-tested every frame — the shape is rigid, so its
 * adjacency never changes, which is the difference between this and the free
 * field in `node-field.tsx`.
 *
 * `prefers-reduced-motion: reduce` paints one frame, ignores the pointer, and
 * repositions on scroll only. Hidden below `lg`: on a phone it would sit under
 * the copy, and the hero already carries a full-page field behind it.
 */

/**
 * Side-view brain, facing left, in a 200x170 space.
 *
 * Hand-authored rather than traced from an existing illustration, so there is
 * no third-party artwork in the repo and nothing to attribute.
 */
const BRAIN_PATHS = [
  // Cortex silhouette. The bumps are deliberate: a smooth ellipse reads as an
  // egg, and the lobing is most of what makes this legible at a glance.
  "M 152 34 C 168 40 176 56 172 72 C 180 82 178 96 166 102 C 168 114 158 124 144 122 C 136 134 118 136 108 128 C 96 136 78 134 70 124 C 54 128 40 118 40 104 C 26 98 22 82 30 70 C 22 56 30 38 46 32 C 52 18 72 12 86 20 C 96 10 116 10 124 20 C 134 16 148 22 152 34 Z",
  // Cerebellum.
  "M 150 116 C 166 118 176 132 166 143 C 156 152 138 149 134 138",
  // Brain stem.
  "M 122 130 C 125 145 120 157 111 162",
  // Gyri. Four, not more: past that the interior fills in and the silhouette
  // stops reading.
  "M 52 60 C 68 52 84 64 96 56 C 108 48 124 58 140 52",
  "M 46 82 C 62 74 78 88 92 80 C 106 72 122 84 140 76",
  "M 54 102 C 70 94 84 106 100 100 C 114 95 128 104 146 98",
  "M 70 40 C 84 34 100 42 114 36",
];

/** Points sampled per unit of path length. Tuned so the outline reads at hero size. */
const SAMPLE_DENSITY = 0.09;
/** Squared distance in normalised space below which two points are cross-linked. */
const CROSS_LINK = 0.014;

type Point = { x: number; y: number; z: number };

export function BrainField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let progress = 0;
    /** Pointer in normalised canvas space, or null when it has left. */
    let pointer: { x: number; y: number } | null = null;

    let points: Point[] = [];
    /** Index pairs, computed once — the shape is rigid so adjacency is fixed. */
    let edges: [number, number][] = [];
    let palette: [number, number, number][] = [];
    let accent: [number, number, number] = [255, 138, 0];

    function buildGeometry() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "0");
      svg.setAttribute("height", "0");
      svg.style.position = "absolute";
      svg.style.opacity = "0";
      document.body.appendChild(svg);

      const raw: Point[] = [];
      /** Start index of each path, so contour links never jump between paths. */
      const runs: [number, number][] = [];

      for (const d of BRAIN_PATHS) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute("d", d);
        svg.appendChild(path);

        const length = path.getTotalLength();
        const count = Math.max(6, Math.round(length * SAMPLE_DENSITY));
        const start = raw.length;

        for (let i = 0; i < count; i++) {
          const at = path.getPointAtLength((i / count) * length);
          raw.push({
            x: at.x,
            y: at.y,
            // A little depth so the rotation has something to reveal. Without
            // it the shape squashes to a line at 90 degrees instead of turning.
            z: (Math.random() * 2 - 1) * 0.16,
          });
        }
        runs.push([start, raw.length]);
      }

      svg.remove();

      // Normalise into [-1, 1] on the longer axis, centred.
      const xs = raw.map((p) => p.x);
      const ys = raw.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const span = Math.max(maxX - minX, maxY - minY) / 2;
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      points = raw.map((p) => ({
        x: (p.x - midX) / span,
        y: (p.y - midY) / span,
        z: p.z,
      }));

      edges = [];
      // Contour links: consecutive samples within the same path only.
      for (const [start, end] of runs) {
        for (let i = start; i < end - 1; i++) edges.push([i, i + 1]);
      }
      // Cross-links: everything else that happens to be near. This is the pass
      // that turns a line drawing into a network.
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 2; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          if (dx * dx + dy * dy < CROSS_LINK) edges.push([i, j]);
        }
      }
    }

    function readPalette() {
      palette = ["--chart-2", "--chart-3", "--chart-4"].map(resolveToken);
      accent = resolveToken("--primary");
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

    function readProgress() {
      // Measured off the window, not off the canvas rect. The canvas is 135%
      // of the card's height and offset upward, so its own rect put progress
      // near 0.47 at the very top of the page — the brain arrived already
      // three-quarters turned, which is why it first rendered as loose lines
      // rather than as a shape.
      //
      // 0 at the top of the document, 1 once one viewport has passed, which is
      // roughly the height of the hero.
      progress = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      if (points.length === 0) return;

      // Bounded, not accumulating. `time * k` walks through every angle
      // forever, and this shape only reads from the side — a brain turned 90
      // degrees is a vertical line. Scroll turns it about 45 degrees total and
      // the idle is a slow sway of roughly six.
      const idle = reduced.matches ? 0 : Math.sin(time * 0.0004) * 0.1;
      const angle = progress * 0.8 + idle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const parallaxX = pointer ? (pointer.x - 0.5) * 26 : 0;
      const parallaxY = pointer ? (pointer.y - 0.5) * 18 : 0;

      // 0.22, not 0.46: `depth * 2.4` downstream is already an amplifier, and
      // at 0.46 the silhouette spanned about 1200px inside a 760px canvas, so
      // only the middle of the brain was ever on screen.
      const scale = Math.min(width, height) * 0.22;
      const cx = width / 2 + parallaxX;
      // Drifts upward as the hero leaves, so it never sits perfectly still.
      const cy = height / 2 + parallaxY - progress * height * 0.08;

      const projected = points.map((p) => {
        const rx = p.x * cos - p.z * sin;
        const rz = p.x * sin + p.z * cos;
        const depth = 1 / (2.4 - rz);
        const sx = cx + rx * scale * depth * 2.4;
        const sy = cy + p.y * scale * depth * 2.4;

        // Pointer excitation, in canvas space so it tracks what is on screen
        // rather than what is in model space.
        let heat = 0;
        if (pointer) {
          const px = pointer.x * width;
          const py = pointer.y * height;
          const d = Math.hypot(sx - px, sy - py);
          heat = Math.max(0, 1 - d / 190);
        }

        return { sx, sy, depth, heat };
      });

      for (const [i, j] of edges) {
        const a = projected[i];
        const b = projected[j];
        const heat = Math.max(a.heat, b.heat);
        const [r, g, bl] = palette[(i + j) % palette.length];
        const base = (a.depth + b.depth) * 0.42;
        ctx!.strokeStyle = `rgba(${r},${g},${bl},${Math.min(0.85, base + heat * 0.6)})`;
        ctx!.lineWidth = 0.75 + heat * 0.9;
        ctx!.beginPath();
        ctx!.moveTo(a.sx, a.sy);
        ctx!.lineTo(b.sx, b.sy);
        ctx!.stroke();
      }

      projected.forEach((p, i) => {
        // Every twelfth node takes the accent, so the orange reads as scattered
        // activity across the shape rather than one stray dot.
        const useAccent = i % 12 === 0;
        const [r, g, bl] = useAccent ? accent : palette[i % palette.length];
        const radius = (0.9 + p.depth * 1.9) * (1 + p.heat * 1.5);
        ctx!.fillStyle = `rgba(${r},${g},${bl},${Math.min(1, 0.45 + p.depth * 0.8 + p.heat * 0.5)})`;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function tick(time: number) {
      if (!running) return;
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
    buildGeometry();
    resize();
    readProgress();
    draw(0);

    const onScroll = () => {
      readProgress();
      if (reduced.matches) draw(0);
    };
    const onResize = () => {
      resize();
      readProgress();
      draw(0);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (reduced.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };
    const onPointerLeave = () => {
      pointer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

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
    // On window, not on the canvas: the canvas is `pointer-events-none` so the
    // buttons underneath stay clickable, which means it never receives a
    // pointer event of its own.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none size-full", className)}
    />
  );
}
