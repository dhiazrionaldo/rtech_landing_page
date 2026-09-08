import type { CapabilityId } from "./capabilities.ts";
import type { Locale } from "./i18n.ts";

/**
 * The object in the hero is a labelled composite of the architecture RTECH
 * actually ships — not an abstraction of "AI".
 *
 * CLAUDE.md sets the test this has to pass: "If it degrades into unlabeled dots
 * and lines, it has become the neural-network cliché — reject it and propose
 * something else." Labels are the whole difference between a diagram of this
 * company's work and a stock picture of a brain.
 *
 * Every node is real. `erp` and `hris` are systems the client already bought;
 * `integration`, `agent`, `forecast` and `tablet` are what we build; `onprem` is
 * the machine it runs on, which is the answer to "where does our data go".
 */
export const ARCH_NODE_IDS = [
  "erp",
  "hris",
  "integration",
  "agent",
  "forecast",
  "tablet",
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
  {
    id: "erp",
    label: { en: "ERP", id: "ERP" },
    position: [-1.6, 2.2, 0],
    capability: null,
  },
  {
    id: "hris",
    label: { en: "HRIS", id: "HRIS" },
    position: [1.6, 2.2, -0.4],
    capability: null,
  },
  {
    id: "integration",
    label: { en: "Integration layer", id: "Lapisan integrasi" },
    position: [0, 0.9, 0],
    capability: "erp",
  },
  {
    id: "agent",
    label: { en: "AI agent", id: "Agen AI" },
    position: [-1.5, -0.3, 0.3],
    capability: "ai-agents",
  },
  {
    id: "forecast",
    label: { en: "Forecasting", id: "Prediksi" },
    position: [1.5, -0.3, -0.3],
    capability: "ai-apps",
  },
  {
    id: "tablet",
    label: { en: "Field tablet", id: "Tablet lapangan" },
    position: [0, -1.6, 0.2],
    capability: "web-apps",
  },
  {
    // The plinth. Deliberately has no edges: it is not a step in the flow, it
    // is the ground the whole thing stands on. That is the argument — the model
    // runs on a box in your building.
    id: "onprem",
    label: { en: "On-premise server", id: "Server on-premise" },
    position: [0, -2.6, 0],
    capability: "hardware",
  },
];

const edges: ArchEdge[] = [
  { from: "erp", to: "integration" },
  { from: "hris", to: "integration" },
  { from: "integration", to: "agent" },
  { from: "integration", to: "forecast" },
  { from: "agent", to: "tablet" },
  { from: "forecast", to: "tablet" },
];

export const architecture = { nodes, edges };
