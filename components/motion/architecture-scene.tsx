"use client";

import { Edges, Line, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";

import {
  architecture,
  type ArchEdge,
  type ArchNode,
  type ArchNodeId,
} from "@/content/architecture";
import type { Locale } from "@/content/i18n";
import { resolveToken } from "@/lib/token-color";

/**
 * The page's one orchestrated moment: the architecture we actually ship, drawn
 * as a diagram you can see the depth of.
 *
 * Not a brain and not a node field. Every glyph is a named part of a real
 * system, and the on-premise server is the slab the whole diagram stands on —
 * the visual answer to "where does our data go", which is the question this
 * audience asks first.
 *
 * Task 10b turned this from a hero-only object into a fixed layer that
 * persists down the page (mounted once, in `app/[locale]/page.tsx`, behind
 * every section) and eases left or right depending on which section holds the
 * viewport centre. `poseRef` carries that target — see `nearestPose` below —
 * and `Diagram`'s own `useFrame` damps its group toward it every render.
 * `frameloop="demand"` means nothing renders on its own; the scroll handler
 * and the pulse tick below are what call `invalidate()`, and both stop while
 * the tab is hidden.
 *
 * Task 10c moved the layer to the FOREGROUND (see `app/[locale]/page.tsx` for
 * the z-index this now carries) after two rounds of client feedback that the
 * object at `-z-10` read as "not clearly shown". Colour is read from the
 * design tokens at runtime, never hardcoded, and re-read when the theme class
 * changes. `--primary` appears nowhere: burnt orange belongs to the call to
 * action. The palette is now the full teal instrument ramp (`--chart-1` /
 * `--chart-3`) rather than the near-white/grey scheme Task 10b shipped — see
 * `readColors` below and the task report for why.
 */

/** Label type size in scene units. IBM Plex Mono advances 0.6em per glyph. */
const FONT_SIZE = 0.155;
const MONO_ADVANCE = 0.6;
const CHIP_PAD_X = 0.11;
const CHIP_PAD_Y = 0.075;
/** Gap between a node glyph and its label plate. */
const LABEL_GAP = 0.34;
/** Seconds for one pulse to travel an edge end to end. */
const PULSE_PERIOD = 2.4;

/**
 * Longest a label line is allowed to run before `wrapLabel` breaks it onto a
 * second line. Task 10c's seven new labels ("AI checklist generator",
 * "Predictive maintenance") are meaningfully longer than anything in the
 * 14-node graph, and a single-line plate at that length is wide enough that
 * two same-tier neighbours' plates overlap regardless of how far apart the
 * nodes sit within the frustum this camera can afford. Wrapping to two lines
 * roughly halves the plate's width for the long labels and costs nothing for
 * the short ones (`ERP`, `WMS`, ...), which never reach this limit. Applied
 * uniformly rather than only to the new labels, so every plate in the scene
 * is sized by the same rule.
 */
const LABEL_LINE_CHARS = 15;
/** Line-to-line spacing for a wrapped, two-line label, in scene units. */
const LABEL_LINE_HEIGHT = FONT_SIZE * 1.25;

/**
 * Breaks a label into at most two lines on a word boundary, greedily filling
 * the first line up to `LABEL_LINE_CHARS`. Deterministic and synchronous —
 * unlike drei's own `Text` reflow, this can be computed once and reused for
 * both the plate's geometry and the node's own outboard offset, which is the
 * same reasoning the file already applied to single-line width: the face is
 * monospaced, so counting characters is exact and costs no layout.
 */
function wrapLabel(text: string): [string] | [string, string] {
  if (text.length <= LABEL_LINE_CHARS) return [text];
  const words = text.split(" ");
  let line1 = "";
  let i = 0;
  for (; i < words.length; i++) {
    const next = line1 ? `${line1} ${words[i]}` : words[i];
    if (line1 && next.length > LABEL_LINE_CHARS) break;
    line1 = next;
  }
  const line2 = words.slice(i).join(" ");
  return line2 ? [line1, line2] : [line1];
}

/** Plate width from the longer of a label's (up to two) lines. */
function labelWidth(lines: readonly string[]): number {
  const maxChars = Math.max(...lines.map((line) => line.length));
  return maxChars * MONO_ADVANCE * FONT_SIZE + CHIP_PAD_X * 2;
}

/** Plate height for one or two lines, with the usual padding. */
function labelHeight(lines: readonly string[]): number {
  return lines.length * LABEL_LINE_HEIGHT + CHIP_PAD_Y * 2;
}

/**
 * World units the diagram eases toward per unit of `data-object-x` (which
 * sections declare in the range -1..1). At the ±0.55 the choreography
 * actually uses, this is a ~1.2 unit shift — enough to read as the object
 * sitting to one side of the screen while still leaving margin inside the
 * frustum widened in Step 5, on both the widened graph and the shifted pose.
 */
const POSE_SHIFT = 2.2;
/**
 * Task 10b kept this layer at 16-30% opacity because it sat *behind* every
 * section (`-z-10`) and had to compete with body copy sitting on top of it —
 * a low ceiling was the only lever available to keep paragraphs readable.
 * Task 10c removes that constraint at the root: the layer is now in front
 * (see `app/[locale]/page.tsx`), and every piece of text on the page is
 * elevated above it with its own `z-30` (billboard copy, section headers,
 * `DarkPanel`'s content, every card) — see the report for the full list of
 * touch points. Legibility is now a DOM stacking fact, not an opacity
 * negotiation, so the object can run at near-full strength everywhere it is
 * on screen, which is what "in front of, at full strength" in the brief
 * actually asks for.
 */
const OBJECT_OPACITY = 0.92;
/** Contact's pose (`data-object-x="0"`) still reads as "fade to nothing" —
 *  the CTA is the moment there, not the object. Unchanged from Task 10b. */
const FADE_OPACITY = 0;
/** Damping rate for both the position ease and the opacity cross-fade. */
const EASE_LAMBDA = 3.2;
/** Pulse/redraw tick. Capped well under 60fps because this layer is on
 * screen for the whole page, not just a hero that pauses off-screen. */
const TICK_MS = 1000 / 20;

type Pose = { x: number; opacity: number };
type PoseRef = { current: Pose };

/**
 * Reads every section's `[data-object-x]` and returns the pose of whichever
 * one is nearest the viewport's vertical centre. `data-object-x="0"` (Contact)
 * reads as "fade out" — the CTA is the moment there, not the object. Every
 * other pose now shares one opacity (`OBJECT_OPACITY`): Task 10b split hero
 * from mid-page because the mid-page poses sat behind body copy and needed a
 * lower ceiling; Task 10c's foreground layer removes that distinction — see
 * `OBJECT_OPACITY` above.
 */
function nearestPose(): Pose {
  if (typeof document === "undefined") return { x: 0, opacity: OBJECT_OPACITY };
  const els = document.querySelectorAll<HTMLElement>("[data-object-x]");
  const viewportCenter = window.innerHeight / 2;

  // A plain for-of, not `.forEach`, because TypeScript's control-flow
  // narrowing does not track reassignment of an outer `let` from inside a
  // closure — `best` would still read as `null` after the loop.
  let best: HTMLElement | null = null;
  let bestDistance = Infinity;
  for (const el of els) {
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = el;
    }
  }

  if (!best) return { x: 0, opacity: OBJECT_OPACITY };
  const raw = Number(best.dataset.objectX ?? "0");
  const opacity = raw === 0 ? FADE_OPACITY : OBJECT_OPACITY;
  return { x: raw * POSE_SHIFT, opacity };
}

type SceneColors = {
  /** `--chart-1`: node wireframes and the travelling pulses. Bright by
   *  design — L 0.855, the top of the teal ramp — because "the nodes and
   *  brain is not clearly show" was the client's exact complaint. */
  nodeGeometry: string;
  /** `--chart-3`: edges, and the plinth's edging. Darker than the node/pulse
   *  colour so the lines read as structure rather than competing with the
   *  nodes for attention. */
  edge: string;
  /** `--foreground`: label text. Never the teal ramp — a label is copy, and
   *  copy stays on the same token every other word on the page uses. */
  label: string;
  /** `--card`: the plinth and the label plates. */
  surface: string;
};

function readColors(): SceneColors {
  const rgb = (token: string) => {
    const [r, g, b] = resolveToken(token);
    return `rgb(${r}, ${g}, ${b})`;
  };
  return {
    nodeGeometry: rgb("--chart-1"),
    edge: rgb("--chart-3"),
    label: rgb("--foreground"),
    surface: rgb("--card"),
  };
}

/**
 * A label plate: one or two lines of text on an opaque `--card` plane.
 *
 * The plate is what makes the labels legible. Even sitting in front of the
 * page now (Task 10c), a node's own colour is the bright top of the teal
 * ramp — great for the wireframe, too saturated to read as fifteen-odd small
 * words of running text — so the label keeps its own `--foreground` colour on
 * its own `--card` surface rather than borrowing the node's colour. That also
 * holds contrast in both themes and reads as the right vocabulary: an
 * architecture diagram is labelled boxes, not floating words.
 *
 * Width and height come from `labelWidth`/`labelHeight` rather than measured,
 * for the same reason as before: the face is monospaced, so the arithmetic on
 * a wrapped, up-to-two-line string is exact and costs no layout.
 */
function Label({
  text,
  position,
  colors,
}: {
  text: string;
  /** Plate centre, relative to the node it labels. */
  position: [number, number, number];
  colors: SceneColors;
}) {
  const lines = wrapLabel(text);
  const width = labelWidth(lines);
  const height = labelHeight(lines);

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={colors.surface} />
      </mesh>
      {lines.map((line, i) => {
        // Centred as a block: one line sits on the plate's own centre line,
        // two lines straddle it symmetrically.
        const y = ((lines.length - 1) / 2 - i) * LABEL_LINE_HEIGHT;
        return (
          <Text
            key={line}
            font="/fonts/ibm-plex-mono-500.ttf"
            fontSize={FONT_SIZE}
            color={colors.label}
            anchorX="center"
            anchorY="middle"
            position={[0, y, 0.01]}
            letterSpacing={0.02}
          >
            {line}
          </Text>
        );
      })}
    </group>
  );
}

/** A system we connect to or build: a wireframe octahedron plus its label. */
function Node({ node, label, colors }: { node: ArchNode; label: string; colors: SceneColors }) {
  // Labels sit outboard: left of the left column, right of the right column,
  // left of the centre column. That keeps every plate off the edges it would
  // otherwise cross, without a hand-placed offset per node. Step 5 fixed the
  // clipping this used to cause at the outer columns by widening the camera
  // frustum (see the camera prop below) rather than touching this placement.
  const side = node.position[0] > 0 ? 1 : -1;
  const width = labelWidth(wrapLabel(label));

  return (
    <group position={node.position}>
      <mesh>
        <octahedronGeometry args={[0.23, 0]} />
        <meshBasicMaterial color={colors.nodeGeometry} wireframe />
      </mesh>
      <Label
        text={label}
        position={[side * (LABEL_GAP + width / 2), 0, 0.22]}
        colors={colors}
      />
    </group>
  );
}

/**
 * The on-premise server: a slab under everything, with no edges into it.
 *
 * It is deliberately not a step in the flow. It is the ground the flow stands
 * on. That is the argument the object exists to make.
 */
function Plinth({ node, label, colors }: { node: ArchNode; label: string; colors: SceneColors }) {
  return (
    <group position={node.position}>
      <mesh>
        <boxGeometry args={[5.4, 0.2, 2.1]} />
        <meshBasicMaterial color={colors.surface} />
        {/* Without an outline an unlit box is a flat silhouette. The outline is
            what makes it read as a slab with a top and a front. */}
        <Edges color={colors.edge} lineWidth={1.1} />
      </mesh>
      {/* Standing on the slab rather than beside it: `z` clears the box's front
          face (depth 2.1, so the face is at 1.05) and `y` clears its top. */}
      <Label text={label} position={[0, 0.31, 1.14]} colors={colors} />
    </group>
  );
}

/** One signal travelling one edge, fading in and out at the ends. */
function Pulse({
  from,
  to,
  offset,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  offset: number;
  color: string;
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = ((clock.elapsedTime / PULSE_PERIOD + offset) % 1 + 1) % 1;
    mesh.position.set(
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t,
    );
    const material = mesh.material;
    if (!Array.isArray(material) && "opacity" in material) {
      material.opacity = Math.sin(Math.PI * t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.058, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

function Diagram({
  locale,
  colors,
  poseRef,
}: {
  locale: Locale;
  colors: SceneColors;
  poseRef: PoseRef;
}) {
  const group = useRef<Group>(null);
  const byId = new Map<ArchNodeId, ArchNode>(
    architecture.nodes.map((node) => [node.id, node]),
  );

  // A slow sway rather than a spin, plus the section choreography: the group's
  // x position is damped toward whichever section currently owns the
  // viewport centre. Damped, not tweened — `MathUtils.damp` is
  // framerate-independent, which matters here because `frameloop="demand"`
  // means frames arrive at an uneven cadence (up to display refresh while
  // scrolling, throttled to the 20fps tick otherwise).
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y = -0.16 + Math.sin(clock.elapsedTime * 0.24) * 0.075;
    group.current.rotation.x = 0.05 + Math.sin(clock.elapsedTime * 0.19) * 0.025;
    group.current.position.x = MathUtils.damp(
      group.current.position.x,
      poseRef.current.x,
      EASE_LAMBDA,
      delta,
    );
  });

  const endpoints = (edge: ArchEdge) => ({
    from: byId.get(edge.from)!.position,
    to: byId.get(edge.to)!.position,
  });

  return (
    <group ref={group}>
      {architecture.edges.map((edge) => {
        const { from, to } = endpoints(edge);
        return (
          <Line
            key={`${edge.from}-${edge.to}`}
            points={[from, to]}
            color={colors.edge}
            lineWidth={1.1}
          />
        );
      })}

      {architecture.edges.map((edge, index) => {
        const { from, to } = endpoints(edge);
        return (
          <Pulse
            key={`pulse-${edge.from}-${edge.to}`}
            from={from}
            to={to}
            offset={index * 0.37}
            color={colors.nodeGeometry}
          />
        );
      })}

      {architecture.nodes.map((node) =>
        node.id === "onprem" ? (
          <Plinth key={node.id} node={node} label={node.label[locale]} colors={colors} />
        ) : (
          <Node key={node.id} node={node} label={node.label[locale]} colors={colors} />
        ),
      )}
    </group>
  );
}

export function ArchitectureScene({ locale }: { locale: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  // Read on first render rather than in an effect: this component is only ever
  // rendered in the browser (`dynamic(..., { ssr: false })`), so `document` is
  // there, and resolving up front means the canvas never mounts with the wrong
  // colours and never triggers a cascading re-render.
  const [colors, setColors] = useState<SceneColors>(readColors);
  const poseRef = useRef<Pose>({ x: 0, opacity: OBJECT_OPACITY });
  const invalidateRef = useRef<(() => void) | null>(null);
  const opacityRef = useRef(0);

  // Tokens are OKLCH custom properties, so they can only be read once there is
  // a document. Re-read whenever the theme class on <html> changes: the canvas
  // has to recolour with the rest of the page, not sit in the wrong theme.
  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // The choreography: read the nearest section's pose on scroll and resize,
  // ease toward it (position via the Three.js group, opacity via a direct
  // style write here — cheaper than a React re-render 20 times a second), and
  // keep the scene alive at a capped rate rather than a free-running 60fps
  // loop for the length of the page. See Step 6/7 in the task brief for why
  // this shape: a fixed layer cannot rely on an off-screen pause the way a
  // hero-only object could.
  //
  // Fix-round 1: `frameloop="demand"` does not render a first frame on its
  // own — nothing is on screen until something calls `invalidate()`. The
  // pulse tick below does call it every 50ms, but only once `invalidateRef`
  // is populated, and that happens in `onCreated`, which fires from R3F's
  // own effect timing, not ours. Waiting on that race meant the object could
  // sit fully computed but never drawn until the *next* thing that happened
  // to invalidate — which in practice was the first scroll, because
  // `onScrollOrResize` also calls `invalidateRef.current?.()`. The fix is to
  // never depend on that race for the first frame: `onCreated` recomputes
  // the pose and calls `state.invalidate()` itself, synchronously, the
  // moment the store's own `invalidate` exists — so the very first paint is
  // deterministic, not "whatever fires next kicks it off."
  useEffect(() => {
    let rafHandle = 0;
    let scrollScheduled = false;
    let lastTick = performance.now();
    // `document.fonts.ready` is the one async callback here that can resolve
    // after this effect has already cleaned up (fonts loading slower than a
    // fast unmount, e.g. a locale switch). Nothing else needs this guard —
    // the interval and the DOM listeners are removed synchronously below —
    // but a bare `.then(recomputeAndInvalidate)` would otherwise run against
    // a stale `invalidateRef` on an unmounted component.
    let cancelled = false;

    const applyOpacity = (dt: number) => {
      const el = host.current;
      if (!el) return;
      const target = poseRef.current.opacity;
      opacityRef.current = MathUtils.damp(opacityRef.current, target, EASE_LAMBDA, dt);
      el.style.opacity = opacityRef.current.toFixed(3);
    };

    const recomputePose = () => {
      poseRef.current = nearestPose();
    };

    const recomputeAndInvalidate = () => {
      recomputePose();
      invalidateRef.current?.();
    };

    const onScrollOrResize = () => {
      if (scrollScheduled || document.visibilityState === "hidden") return;
      scrollScheduled = true;
      rafHandle = requestAnimationFrame(() => {
        scrollScheduled = false;
        recomputeAndInvalidate();
      });
    };

    recomputePose();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      const now = performance.now();
      const dt = Math.min(0.2, (now - lastTick) / 1000);
      lastTick = now;
      applyOpacity(dt);
      invalidateRef.current?.();
    }, TICK_MS);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    // Fonts and the poster image can change section offsets after the first
    // paint — a late webfont swap is the one that reliably bites `Section`'s
    // sticky badge column and the billboard's own layout (see `lib/motion.ts`
    // for the identical ScrollTrigger-refresh reasoning). Re-reading the pose
    // once layout has actually settled catches a section boundary that moved
    // out from under the first, early measurement.
    window.addEventListener("load", recomputeAndInvalidate);
    void document.fonts?.ready?.then(() => {
      if (cancelled) return;
      recomputeAndInvalidate();
    });

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("load", recomputeAndInvalidate);
      if (rafHandle) cancelAnimationFrame(rafHandle);
      // Task 10c fix round 1: this used to null `invalidateRef.current` here
      // as a belt-and-braces guard. That is wrong under React's dev-only
      // Strict Mode double-invoke: this effect and `<Canvas>`'s own internal
      // mount effect are independent, so React can run THIS cleanup (nulling
      // the ref) after `onCreated` has already fired once but before — or
      // without — `onCreated` firing again to restore it. Every remaining
      // interval tick then calls `invalidateRef.current?.()` against `null`
      // forever: it never throws, so nothing crashes, but the scene never
      // gets another `invalidate()` call and no frame after the first ever
      // paints. `cancelled` (checked in every async callback that can
      // outlive this effect — `document.fonts.ready` — and `clearInterval`
      // above stopping the tick outright) already does the actual job this
      // line was for, without the race: nothing here calls through the ref
      // once cleanup has run. Leaving the ref itself alone means a stale
      // pointer briefly survives an unmount, which is harmless — calling
      // Three.js's own `invalidate` on a store nothing still ticks toward is
      // a no-op, not a leak.
    };
  }, []);

  return (
    <div ref={host} className="size-full" style={{ opacity: 0 }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        flat
        gl={{ antialias: true, powerPreference: "high-performance" }}
        // Widened again in Task 10c: seven tier-4 nodes zigzagged across x
        // -2.9..2.8 push the widest labels out past the 14-node graph's
        // -2.4..2.4, even after `wrapLabel` shrinks their footprint. fov 47 /
        // z 11.6 (from 44 / 11) buys back the margin — screenshot-verified at
        // 1440x900 and 1024x768, see the report.
        camera={{ position: [0, -0.1, 11.6], fov: 47 }}
        onCreated={(state) => {
          // The deterministic first frame: capture `invalidate` and use it in
          // the same breath, rather than trusting some later tick or scroll
          // event to be the first thing that happens to call it.
          invalidateRef.current = state.invalidate;
          poseRef.current = nearestPose();
          state.invalidate();
        }}
      >
        <Diagram locale={locale} colors={colors} poseRef={poseRef} />
      </Canvas>
    </div>
  );
}
