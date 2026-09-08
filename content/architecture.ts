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
 * is OPTIGAIN, `agent` is the HR agent. Tier 4 is where the operator works —
 * `mobile` is the HR agent's own app. `onprem` is the machine it all runs on,
 * which is the answer to "where does our data go".
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
  { id: "erp",         label: { en: "ERP",                id: "ERP" },                position: [-2.4, 3.0,  0.0], capability: null },
  { id: "hris",        label: { en: "HRIS",               id: "HRIS" },               position: [-0.8, 3.0, -0.4], capability: null },
  { id: "wms",         label: { en: "WMS",                id: "WMS" },                position: [ 0.8, 3.0, -0.4], capability: null },
  { id: "scada",       label: { en: "SCADA",              id: "SCADA" },              position: [ 2.4, 3.0,  0.0], capability: null },

  // Tier 2 — what we build to connect them.
  { id: "integration", label: { en: "Integration layer",  id: "Lapisan integrasi" },  position: [-0.9, 1.5,  0.2], capability: "erp" },
  { id: "pipeline",    label: { en: "Data pipeline",      id: "Alur data" },          position: [ 0.9, 1.5, -0.2], capability: "erp" },

  // Tier 3 — the AI capabilities, each one a system we shipped.
  { id: "agent",       label: { en: "AI agent",           id: "Agen AI" },            position: [-2.2, 0.0,  0.3], capability: "ai-agents" },
  { id: "forecast",    label: { en: "Forecasting",        id: "Prediksi" },           position: [-0.75, 0.0, 0.0], capability: "ai-apps" },
  { id: "vision",      label: { en: "Computer vision",    id: "Computer vision" },    position: [ 0.75, 0.0, 0.0], capability: "ai-apps" },
  { id: "extraction",  label: { en: "Document reading",   id: "Pembacaan dokumen" },  position: [ 2.2, 0.0, -0.3], capability: "ai-agents" },

  // Tier 4 — where the operator actually works.
  { id: "tablet",      label: { en: "Field tablet",       id: "Tablet lapangan" },    position: [-1.5, -1.5, 0.2], capability: "web-apps" },
  { id: "command",     label: { en: "Command centre",     id: "Pusat kendali" },      position: [ 0.0, -1.5, 0.0], capability: "web-apps" },
  { id: "mobile",      label: { en: "Mobile app",         id: "Aplikasi mobile" },    position: [ 1.5, -1.5, 0.2], capability: "web-apps" },

  // Tier 5 — the ground the whole thing stands on. Deliberately edgeless.
  {
    // The plinth. Deliberately has no edges: it is not a step in the flow, it
    // is the ground the whole thing stands on. That is the argument — the model
    // runs on a box in your building.
    id: "onprem",
    label: { en: "On-premise server", id: "Server on-premise" },
    position: [0.0, -2.9, 0.0],
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
];

export const architecture = { nodes, edges };
