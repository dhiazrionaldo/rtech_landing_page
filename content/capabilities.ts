import type { Locale } from "./i18n.ts";

/**
 * The five service lines, in the order they appear in the first rail.
 *
 * Order is meaning here. Hardware is last on purpose: the page is positioned
 * software-led, and hardware is the backbone that answers "where does our data
 * go", not a co-equal headline. See D1 in the design spec.
 */
export const CAPABILITY_IDS = [
  "ai-agents",
  "web-apps",
  "erp",
  "ai-apps",
  "hardware",
] as const;

export type CapabilityId = (typeof CAPABILITY_IDS)[number];

/**
 * Icons are named here and resolved to components in the component layer.
 *
 * This module must stay importable by `node --test`, and it is also pulled in
 * by `lib/chat/grounding.ts`, which builds a text prompt inside a serverless
 * route. Neither has any use for an icon set. A string id costs nothing and
 * keeps both clean.
 */
export const CAPABILITY_ICON_IDS = [
  "bot",
  "layout-grid",
  "workflow",
  "boxes",
  "cpu",
] as const;

export type CapabilityIconId = (typeof CAPABILITY_ICON_IDS)[number];

export type Capability = {
  id: CapabilityId;
  name: string;
  /** The claim. One line, no full stop. */
  line: string;
  /** One sentence of substance under the claim. */
  body: string;
  icon: CapabilityIconId;
};

const en: Capability[] = [
  {
    id: "ai-agents",
    name: "AI Agents",
    line: "Software that does the step, not just the screen",
    body: "Agents that read your data, decide, and act inside the systems you already run.",
    icon: "bot",
  },
  {
    id: "web-apps",
    name: "Custom Web Apps",
    line: "The application your process actually needs",
    body: "Built around your workflow, instead of bending your workflow around someone's product.",
    icon: "layout-grid",
  },
  {
    id: "erp",
    name: "ERP Integration",
    line: "One source of truth across the systems you already bought",
    body: "SAP, Oracle, in-house. Connected, so nobody re-types the same number twice.",
    icon: "workflow",
  },
  {
    id: "ai-apps",
    name: "AI Applications",
    line: "Forecasting, vision and decision support on your own data",
    body: "Prediction and analysis that sits where the operator already works.",
    icon: "boxes",
  },
  {
    id: "hardware",
    name: "Hardware & IT Services",
    line: "We supply and service the machines it runs on",
    body: "Servers, edge devices, field tablets, procurement and support. On-premise, where the data has to stay.",
    icon: "cpu",
  },
];

const id: Capability[] = [
  {
    id: "ai-agents",
    name: "Agen AI",
    line: "Perangkat lunak yang mengerjakan langkahnya, bukan cuma layarnya",
    body: "Agen yang membaca data Anda, mengambil keputusan, dan bertindak di dalam sistem yang sudah Anda pakai.",
    icon: "bot",
  },
  {
    id: "web-apps",
    name: "Aplikasi Web Custom",
    line: "Aplikasi yang memang dibutuhkan proses Anda",
    body: "Dibangun mengikuti alur kerja Anda, bukan memaksa alur kerja mengikuti produk orang lain.",
    icon: "layout-grid",
  },
  {
    id: "erp",
    name: "Integrasi ERP",
    line: "Satu sumber data untuk sistem yang sudah Anda beli",
    body: "SAP, Oracle, atau sistem internal. Tersambung, jadi tidak ada angka yang diketik ulang dua kali.",
    icon: "workflow",
  },
  {
    id: "ai-apps",
    name: "Aplikasi AI",
    line: "Prediksi, computer vision, dan dukungan keputusan di atas data Anda sendiri",
    body: "Analisis yang muncul di tempat operator sudah bekerja.",
    icon: "boxes",
  },
  {
    id: "hardware",
    name: "Perangkat Keras dan Layanan IT",
    line: "Kami menyediakan dan merawat mesin tempat sistemnya berjalan",
    body: "Server, perangkat edge, tablet lapangan, pengadaan, dan dukungan. On-premise, di tempat datanya memang harus tinggal.",
    icon: "cpu",
  },
];

export const capabilities: Record<Locale, Capability[]> = { en, id };
