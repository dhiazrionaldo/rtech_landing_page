"use client";

import { Edges, Line, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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
 * Colour is read from the design tokens at runtime, never hardcoded, and
 * re-read when the theme class changes. `--primary` appears nowhere: burnt
 * orange belongs to the call to action.
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

type SceneColors = {
  /** `--foreground`: node wireframes and label text. */
  node: string;
  /** `--border`: edges and the plinth outline. */
  edge: string;
  /** `--chart-2`: the pulses travelling the edges. The data ramp. */
  pulse: string;
  /** `--card`: the plinth and the label plates. */
  surface: string;
};

function readColors(): SceneColors {
  const rgb = (token: string) => {
    const [r, g, b] = resolveToken(token);
    return `rgb(${r}, ${g}, ${b})`;
  };
  return {
    node: rgb("--foreground"),
    edge: rgb("--border"),
    pulse: rgb("--chart-2"),
    surface: rgb("--card"),
  };
}

/**
 * A label plate: the text on an opaque `--card` plane.
 *
 * The plate is what makes the labels legible. The canvas sits over a dimmed
 * photograph, and `--foreground` is near-black in light mode — bare text would
 * disappear there. Setting it on the same surface token the cards use puts the
 * label on a surface instead of on a photo, so it holds contrast in both
 * themes. It also happens to be the right vocabulary: an architecture diagram
 * is labelled boxes, not floating words.
 *
 * Width is computed rather than measured because the face is monospaced — every
 * glyph advances exactly 0.6em, so the arithmetic is exact and costs no layout.
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
  const width = text.length * MONO_ADVANCE * FONT_SIZE + CHIP_PAD_X * 2;
  const height = FONT_SIZE + CHIP_PAD_Y * 2;

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={colors.surface} />
      </mesh>
      <Text
        font="/fonts/ibm-plex-mono-500.ttf"
        fontSize={FONT_SIZE}
        color={colors.node}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0.01]}
        letterSpacing={0.02}
      >
        {text}
      </Text>
    </group>
  );
}

/** A system we connect to or build: a wireframe octahedron plus its label. */
function Node({ node, label, colors }: { node: ArchNode; label: string; colors: SceneColors }) {
  // Labels sit outboard: left of the left column, right of the right column,
  // left of the centre column. That keeps every plate off the edges it would
  // otherwise cross, without a hand-placed offset per node.
  const side = node.position[0] > 0 ? 1 : -1;
  const width = label.length * MONO_ADVANCE * FONT_SIZE + CHIP_PAD_X * 2;

  return (
    <group position={node.position}>
      <mesh>
        <octahedronGeometry args={[0.23, 0]} />
        <meshBasicMaterial color={colors.node} wireframe />
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

function Diagram({ locale, colors }: { locale: Locale; colors: SceneColors }) {
  const group = useRef<Group>(null);
  const byId = new Map<ArchNodeId, ArchNode>(
    architecture.nodes.map((node) => [node.id, node]),
  );

  // A slow sway rather than a spin. Enough parallax to read as an object in
  // space; small enough that the labels stay square to the camera.
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = -0.16 + Math.sin(clock.elapsedTime * 0.24) * 0.075;
    group.current.rotation.x = 0.05 + Math.sin(clock.elapsedTime * 0.19) * 0.025;
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
            color={colors.pulse}
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
  // Starts true because the hero is at the top of the page; the observer
  // corrects it on its first callback either way.
  const [onScreen, setOnScreen] = useState(true);

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

  // Rendering off-screen is wasted battery, so visibility drives `frameloop`
  // rather than merely hiding the element.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="size-full">
      <Canvas
        frameloop={onScreen ? "always" : "never"}
        dpr={[1, 1.5]}
        flat
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, -0.15, 9.6], fov: 38 }}
      >
        <Diagram locale={locale} colors={colors} />
      </Canvas>
    </div>
  );
}
