import type { CapabilityId } from "./capabilities.ts";
import type { Locale } from "./i18n.ts";

/**
 * The object mounted as a fixed layer behind the whole page is a labelled
 * composite of the architecture RTECH actually ships — not an abstraction of
 * "AI".
 *
 * CLAUDE.md sets the test this has to pass: "If it degrades into unlabeled dots
 * and lines, it has become the neural-network cliché — reject it and propose
 * something else." Labels are the whole difference between a diagram of this
 * company's work and a stock picture of a brain.
 *
 * Every node is real. Tier 1 (`erp`, `hris`, `wms`, `scada`) are systems the
 * client already bought, not ours. Tier 2 (`integration`, `pipeline`) is what we
 * build to connect them. Tier 3 is the AI capability layer, and every node there
 * is a system we shipped: `vision` is the HSSE inspection system built for
 * Pertamina, `extraction` is FIFO's vendor-document reading for JAS, `forecast`
 * is OPTIGAIN, `agent` is the HR agent. Tier 4 is the seven named systems those
 * capabilities actually became — pulled verbatim from `expertise.sectors`
 * (Task 10c), nothing invented, one node per project the deck already names on
 * this page. Tier 5 is where the operator works — `mobile` is the HR agent's own
 * app. `onprem` is the machine it all runs on, which is the answer to "where
 * does our data go".
 *
 * ## Task 10c — the seven tier-4 additions
 *
 * The client asked for "more AI nodes" after seeing the 14-node version live.
 * The brief's suggested six-tier layout put all seven new nodes on one shared
 * y (-0.6) with x spread and z stagger doing all the de-collision work. With
 * labels this long — "AI checklist generator", "Predictive maintenance" — that
 * does not clear: two same-side neighbours 0.95 apart still overlap even after
 * `wrapLabel` (see `architecture-scene.tsx`) halves their footprint, because a
 * z stagger of ~1 unit barely shifts anything on screen at this camera
 * distance (see the report for the arithmetic).
 *
 * What actually clears it is a small y stagger *within* tier 4 — a two-row
 * zigzag at y -0.3 / -0.9 rather than one flat row at -0.6. Nothing in the
 * "every edge descends" test cares about a shared y per tier, only that each
 * edge's target sits below its source, and -0.3/-0.9 both still sit strictly
 * between tier 3 (0.7) and tier 5 (-1.9). The x order below still reads
 * left-to-right as hse → piping → warehouse → cargo → checklist → maintenance →
 * sales, matching the brief's list; the zigzag only alternates which of the two
 * y values each one lands on.
 */
export const ARCH_NODE_IDS = [
  "erp",
  "hris",
  "wms",
  "scada",
  "integration",
  "pipeline",
  "agent",
  "forecast",
  "vision",
  "extraction",
  "hse-inspection",
  "piping",
  "warehouse",
  "cargo",
  "checklist",
  "maintenance",
  "sales",
  "tablet",
  "command",
  "mobile",
  "onprem",
] as const;

export type ArchNodeId = (typeof ARCH_NODE_IDS)[number];

export type ArchNode = {
  id: ArchNodeId;
  label: Record<Locale, string>;
  /** Scene units: x right, y up, z toward the viewer. */
  position: [number, number, number];
  /** Which capability this node stands for, or null if we did not build it. */
  capability: CapabilityId | null;
};

export type ArchEdge = { from: ArchNodeId; to: ArchNodeId };

const nodes: ArchNode[] = [
  // Tier 1 — systems the client already bought. Not ours.
  { id: "erp",         label: { en: "ERP",                id: "ERP" },                position: [-2.4, 3.4,  0.0], capability: null },
  { id: "hris",        label: { en: "HRIS",               id: "HRIS" },               position: [-0.8, 3.4, -0.4], capability: null },
  { id: "wms",         label: { en: "WMS",                id: "WMS" },                position: [ 0.8, 3.4, -0.4], capability: null },
  { id: "scada",       label: { en: "SCADA",              id: "SCADA" },              position: [ 2.4, 3.4,  0.0], capability: null },

  // Tier 2 — what we build to connect them.
  // `integration` sits at -1.5 rather than a symmetric -0.9 (Task 10c): at
  // -0.9 its outboard (leftward) label plate sat directly behind the
  // billboard headline's last word ("not" in "do not stop.") — text stayed
  // legible (z-30 always wins) but the plate visibly disappeared behind a
  // glyph, which read as broken rather than merely layered. The label points
  // further left as the node moves left (it is an outboard offset from the
  // node, not a fixed screen position), which is what actually clears the
  // headline's right edge — the first attempt at -0.4 moved the wrong
  // direction and made the overlap worse. Screenshot-verified fix.
  { id: "integration", label: { en: "Integration layer",  id: "Lapisan integrasi" },  position: [-1.5, 2.0,  0.2], capability: "erp" },
  { id: "pipeline",    label: { en: "Data pipeline",      id: "Alur data" },          position: [ 0.9, 2.0, -0.2], capability: "erp" },

  // Tier 3 — the AI capabilities, each one a system we shipped.
  //
  // `vision` sits at 0.45 rather than a symmetric 0.75: at 0.75 its outboard
  // label plate ("Computer vision") overlapped `extraction`'s ("Document
  // reading", or "Pembacaan dokumen" in the longer Indonesian label) — both
  // outboard-right on the same tier, wide enough that the gap between the
  // nodes wasn't wide enough for both plates. Nudging the node, not
  // shortening either label, clears it. See MOTION.md / the task report for
  // the plate-width arithmetic.
  { id: "agent",       label: { en: "AI agent",           id: "Agen AI" },            position: [-2.2, 0.7,  0.3], capability: "ai-agents" },
  { id: "forecast",    label: { en: "Forecasting",        id: "Prediksi" },           position: [-0.75, 0.7, 0.0], capability: "ai-apps" },
  { id: "vision",      label: { en: "Computer vision",    id: "Computer vision" },    position: [ 0.45, 0.7, 0.0], capability: "ai-apps" },
  { id: "extraction",  label: { en: "Document reading",   id: "Pembacaan dokumen" },  position: [ 2.2, 0.7, -0.3], capability: "ai-agents" },

  // Tier 4 — seven real systems, straight from `expertise.sectors`. Task 10c.
  // Zigzagged across two y values (-0.3 / -0.9) rather than one flat row — see
  // the file-header note for why a single shared y did not clear at this
  // label length. Left-to-right x order matches the brief's list; only the
  // y alternation is this file's own addition.
  { id: "hse-inspection", label: { en: "AI HSE inspection",       id: "Inspeksi HSE AI" },        position: [-2.9, -0.3,  0.3], capability: "ai-apps" },
  { id: "piping",         label: { en: "Piping visualisation",    id: "Visualisasi perpipaan" },  position: [-1.95, -0.9, -0.3], capability: "web-apps" },
  { id: "warehouse",      label: { en: "Warehouse management",    id: "Manajemen gudang" },       position: [-1.0, -0.3,  0.3], capability: "web-apps" },
  { id: "cargo",          label: { en: "Cargo execution",         id: "Eksekusi kargo" },         position: [-0.05, -0.9, -0.3], capability: "ai-agents" },
  { id: "checklist",      label: { en: "AI checklist generator",  id: "Generator checklist AI" }, position: [ 0.9, -0.3,  0.3], capability: "ai-apps" },
  { id: "maintenance",    label: { en: "Predictive maintenance",  id: "Pemeliharaan prediktif" }, position: [ 1.85, -0.9, -0.3], capability: "ai-apps" },
  { id: "sales",          label: { en: "Sales prediction",        id: "Prediksi penjualan" },     position: [ 2.8, -0.3,  0.3], capability: "ai-apps" },

  // Tier 5 — where the operator actually works.
  //
  // `tablet` sits at -1.7 rather than -1.5 for the same reason: at -1.5 its
  // label plate just touched `command`'s (both outboard-left on this tier).
  { id: "tablet",      label: { en: "Field tablet",       id: "Tablet lapangan" },    position: [-1.7, -1.9, 0.2], capability: "web-apps" },
  { id: "command",     label: { en: "Command centre",     id: "Pusat kendali" },      position: [ 0.0, -1.9, 0.0], capability: "web-apps" },
  { id: "mobile",      label: { en: "Mobile app",         id: "Aplikasi mobile" },    position: [ 1.5, -1.9, 0.2], capability: "web-apps" },

  // Tier 6 — the ground the whole thing stands on. Deliberately edgeless.
  {
    // The plinth. Deliberately has no edges: it is not a step in the flow, it
    // is the ground the whole thing stands on. That is the argument — the model
    // runs on a box in your building.
    id: "onprem",
    label: { en: "On-premise server", id: "Server on-premise" },
    position: [0.0, -3.2, 0.0],
    capability: "hardware",
  },
];

const edges: ArchEdge[] = [
  { from: "erp",         to: "integration" },
  { from: "hris",        to: "integration" },
  { from: "wms",         to: "pipeline" },
  { from: "scada",       to: "pipeline" },
  { from: "integration", to: "agent" },
  { from: "integration", to: "forecast" },
  { from: "pipeline",    to: "vision" },
  { from: "pipeline",    to: "extraction" },
  { from: "agent",       to: "tablet" },
  { from: "agent",       to: "mobile" },
  { from: "forecast",    to: "command" },
  { from: "vision",      to: "command" },
  { from: "extraction",  to: "tablet" },

  // Task 10c — tier 3 into the seven named systems, and those systems into
  // where the operator works. Every edge still descends.
  { from: "vision",         to: "hse-inspection" },
  { from: "vision",         to: "piping" },
  { from: "agent",          to: "warehouse" },
  { from: "agent",          to: "cargo" },
  { from: "extraction",     to: "checklist" },
  { from: "forecast",       to: "maintenance" },
  { from: "forecast",       to: "sales" },
  { from: "hse-inspection", to: "tablet" },
  { from: "piping",         to: "command" },
  { from: "warehouse",      to: "command" },
  { from: "cargo",          to: "mobile" },
  { from: "checklist",      to: "tablet" },
  { from: "maintenance",    to: "command" },
  { from: "sales",          to: "command" },
];

export const architecture = { nodes, edges };
