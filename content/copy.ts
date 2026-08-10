import type { StaticImageData } from "next/image";

import fireTruckPoster from "@/public/image/capture-fire-truck.webp";
import hssePoster from "@/public/image/capture-hsse.webp";
import optigainPoster from "@/public/image/capture-optigain.webp";

import { pending, type Fillable } from "./pending";
import type { Locale } from "./i18n";

/**
 * All page copy, both languages, sourced from the RTECH INDO company profile
 * deck. Indonesian strings marked "verbatim" are quoted from the deck exactly
 * and must not be reworded without asking.
 *
 * No metric appears anywhere in the deck, so no metric is asserted here beyond
 * facts that are directly countable from it (founding year, sector count,
 * number of listed projects). CLAUDE.md: never invent or inflate a number.
 */

export type Sector = {
  id: string;
  /** Sector name — kept in English in both locales; it is how the deck writes it. */
  name: string;
  discipline: string;
  projects: string[];
};

export type Product = {
  id: string;
  name: string;
  client?: string;
  blurb: string;
};

/**
 * Footage of each system, keyed by product id — the file names in
 * `public/video` already encoded this mapping.
 *
 * Locale-independent, so it sits here rather than in either dictionary.
 *
 * `seconds` is read out of the MP4 `mvhd` box, not estimated. All three files
 * are far past the 2 MB autoplay budget in CLAUDE.md (2.8 / 11.5 / 5.5 MB), so
 * every one of them is click-to-play behind a poster and nothing touches the
 * network until someone asks for it.
 *
 * `kind` is what the asset honestly is. The Fire Truck file is a genuine screen
 * capture of the simulator; the other two are produced films that show the real
 * UI inside device mockups. Labelling all three "screen recording" would
 * overclaim, which is the one thing this page cannot afford to do.
 *
 * Posters are real frames pulled out of the clips themselves, chosen at a point
 * where the system is on screen rather than a title card.
 */
export type ProductCapture = {
  src: string;
  poster: StaticImageData;
  seconds: number;
  kind: "film" | "capture";
};

export const productCaptures: Record<string, ProductCapture> = {
  hsse: {
    src: "/video/hsse.mp4",
    poster: hssePoster,
    seconds: 58.5,
    kind: "film",
  },
  optigain: {
    src: "/video/optigain.mp4",
    poster: optigainPoster,
    seconds: 43.1,
    kind: "film",
  },
  "fire-truck": {
    src: "/video/fire-truck.mp4",
    poster: fireTruckPoster,
    seconds: 20,
    kind: "capture",
  },
};

type Dict = {
  nav: { label: string; href: string }[];
  hero: {
    badge: string;
    headline: string;
    standfirst: string;
    mediaDescription: string;
    panelTitle: string;
    panelBody: string;
  };
  cta: {
    primary: string;
    secondary: string;
    href: Fillable;
  };
  clients: { label: string; note: string };
  about: {
    badge: string;
    heading: string;
    body: string;
    missionLabel: string;
    mission: string;
    visionLabel: string;
    vision: string;
  };
  stats: { value: string; label: string }[];
  expertise: {
    badge: string;
    heading: string;
    body: string;
    sectors: Sector[];
  };
  products: {
    badge: string;
    heading: string;
    body: string;
    items: Product[];
    /** What the asset is, keyed by `ProductCapture["kind"]`. */
    captureKinds: Record<ProductCapture["kind"], string>;
    /** Prefixes the product name to name the play control for screen readers. */
    playLabel: string;
  };
  contact: {
    badge: string;
    heading: string;
    body: string;
    emailLabel: string;
    phoneLabel: string;
  };
  footer: { rights: string; builtIn: string };
};

/** Shared across locales — these are proper nouns, not translatable copy. */
export const contact = {
  email: "dhiazrionaldo@rtechindo.com",
  phone: "0812-788-315-73",
  /** E.164 for the tel: href and JSON-LD. */
  phoneE164: "+6281278831573",
  address: "Jl. Perumahan Rakyat No.11, Sei. Buah, Ilir Timur II, Palembang",
  locality: "Jakarta / Palembang / Bekasi",
} as const;

const sectorsId: Sector[] = [
  {
    id: "oil-gas",
    name: "Oil and Gas",
    discipline: "Spesialis solusi Health, Safety, Security & Environment",
    projects: [
      "AI Digital Inspection",
      "Water Line Piping Visualization & Command Center",
      "Fire Truck Simulator",
    ],
  },
  {
    id: "aviation",
    name: "Aviation",
    discipline: "Spesialis integrasi ERP, kargo, dan operasional",
    projects: [
      "Lounge Management System",
      "Cargo Policy & Procedure AI Agent",
      "Baggage Reconciliation System",
    ],
  },
  {
    id: "manufacture",
    name: "Manufacture",
    discipline: "Integrator ERP dan solusi Warehouse Management",
    projects: [
      "AI Checklist Generator",
      "Predictive Maintenance",
      "AI Recruitment Agent",
      "Strategic Sales Prediction",
    ],
  },
];

const sectorsEn: Sector[] = [
  {
    id: "oil-gas",
    name: "Oil and Gas",
    discipline: "Health, Safety, Security & Environment solution specialists",
    projects: [
      "AI Digital Inspection",
      "Water Line Piping Visualization & Command Center",
      "Fire Truck Simulator",
    ],
  },
  {
    id: "aviation",
    name: "Aviation",
    discipline: "ERP integration, cargo and operational specialists",
    projects: [
      "AI Warehouse Management System",
      "AI Recruitment Agent",
      "AI Cargo Execution System",
    ],
  },
  {
    id: "manufacture",
    name: "Manufacture",
    discipline: "ERP integrator, warehouse management solutions",
    projects: [
      "AI Checklist Generator",
      "Predictive Maintenance",
      "AI Recruitment Agent",
      "Strategic Sales Prediction",
    ],
  },
];

export const copy: Record<Locale, Dict> = {
  id: {
    nav: [
      { label: "Tentang kami", href: "#tentang" },
      { label: "Keahlian", href: "#keahlian" },
      { label: "Produk", href: "#produk" },
      { label: "Hubungi kami", href: "#kontak" },
    ],
    hero: {
      badge: "Sejak 2018 — software agency lintas sektor",
      // "dari lapangan sampai command center" replaces "dari HSSE sampai ...":
      // HSSE reads as oil & gas to anyone outside it, while "lapangan" holds
      // for a plant, a warehouse, or an apron. Keeps the command-center term,
      // which is both a product name and a query the page ranks on.
      headline:
        "Digitalisasi operasi kritikal, dari lapangan sampai command center.",
      // NOT verbatim from the deck any more. The deck line scoped the agency to
      // Oil & Gas; that was costing cross-sector enquiries, so it was reworded
      // with the client's explicit approval on 2026-08-10. Oil & Gas is now
      // stated as where the work started, not the limit of it. The three
      // sectors named are the three actually delivered — no others implied.
      standfirst:
        "Berdiri sejak 2018, membangun sistem untuk operasi yang tidak boleh berhenti. Kami mulai dari Oil & Gas, lalu Aviation dan manufaktur. Cara kerjanya sama di sektor mana pun.",
      mediaDescription:
        "Unit komputasi yang kami pasang di sisi operasional untuk menjalankan beban kerja inferensi.",
      panelTitle: "Integrated HSSE System",
      panelBody:
        "Inspeksi digital, visualisasi jalur pipa, dan command center dalam satu sistem yang berjalan di lingkungan Anda.",
    },
    cta: {
      primary: "Jadwalkan sesi scoping",
      secondary: "Lihat keahlian kami",
      href: pending("URL penjadwalan — Cal.com, Calendly, atau rute formulir"),
    },
    clients: {
      label: "Dipercaya oleh",
      note: "Proyek kompleks untuk Oil & Gas, Aviation, dan manufaktur.",
    },
    about: {
      badge: "Tentang kami",
      heading: "Dari penyedia layanan menjadi mitra strategis digitalisasi.",
      body: "Kami memiliki rekam jejak dalam menangani proyek-proyek kompleks untuk Oil & Gas (Pertamina), Aviation , dan manufaktur, mencakup digitalisasi HSSE dan Command Center operasional.",
      missionLabel: "Misi",
      // Verbatim from the deck.
      mission:
        "Memberikan solusi teknologi yang adaptif, terintegrasi, dan berdampak nyata bagi operasional klien melalui inovasi berkelanjutan.",
      visionLabel: "Visi",
      // Deck-verbatim except for the closing scope: "di industri energi
      // nasional" → "operasi industri di Indonesia". Reworded with the client's
      // explicit approval on 2026-08-10. Every other word is the deck's.
      vision:
        "Menjadi pionir solusi digital berbasis AI yang mengoptimalkan efisiensi dan keamanan operasi industri di Indonesia.",
    },
    stats: [
      { value: "2018", label: "Berdiri sejak" },
      { value: "3", label: "Sektor industri" },
      { value: "10", label: "Proyek dalam portofolio" },
    ],
    expertise: {
      badge: "Keahlian",
      heading: "Tiga sektor, satu cara kerja.",
      body: "Setiap sektor punya kendala operasional yang berbeda. Buka masing-masing untuk melihat proyek yang sudah kami kerjakan.",
      sectors: sectorsId,
    },
    products: {
      badge: "Produk",
      heading: "Sistem yang sudah berjalan.",
      body: "Dibangun untuk operasi nyata, bukan untuk demo.",
      items: [
        {
          id: "hsse",
          name: "Integrated HSSE System",
          blurb:
            "Satu sistem untuk inspeksi digital, visualisasi jalur pipa, dan command center operasional. Tersedia di desktop dan tablet lapangan.",
        },
        {
          id: "optigain",
          name: "OPTIGAIN",
          blurb:
            "Analisis data operasional dengan ringkasan eksekutif dan rekomendasi berbasis AI, dibandingkan berdampingan dengan data historis Anda.",
        },
        {
          id: "fire-truck",
          name: "Fire Truck Simulator",
          client: "Pertamina",
          blurb:
            "Simulasi pelatihan tanggap darurat kebakaran yang interaktif, dipakai untuk melatih tim tanpa menurunkan armada sungguhan.",
        },
      ],
      captureKinds: { film: "Video produk", capture: "Rekaman layar" },
      playLabel: "Putar",
    },
    contact: {
      badge: "Hubungi kami",
      heading: "Terhubung dengan kami.",
      body: "Ceritakan satu proses operasional yang paling menyulitkan tim Anda. Kami petakan bersama dan katakan dengan jujur apakah layak didigitalisasi.",
      emailLabel: "Email",
      phoneLabel: "Telepon",
    },
    footer: {
      rights: "Seluruh hak cipta dilindungi.",
      builtIn: "Indonesia",
    },
  },

  en: {
    nav: [
      { label: "About", href: "#tentang" },
      { label: "Expertise", href: "#keahlian" },
      { label: "Products", href: "#produk" },
      { label: "Contact", href: "#kontak" },
    ],
    hero: {
      badge: "Since 2018 — a cross-sector software agency",
      headline:
        "Digitalising critical operations, from the field to the command centre.",
      standfirst:
        "Founded in 2018, building systems for operations that cannot stop. We started in oil and gas, then aviation and manufacturing. The way we work is the same in any sector.",
      mediaDescription:
        "A compute unit of the kind we deploy on site to run inference workloads.",
      panelTitle: "Integrated HSSE System",
      panelBody:
        "Digital inspection, pipeline visualisation, and a command centre in one system, running inside your environment.",
    },
    cta: {
      primary: "Book a scoping call",
      secondary: "See our expertise",
      href: pending("Booking URL — Cal.com, Calendly, or a form route"),
    },
    clients: {
      label: "Trusted by",
      note: "Complex projects across oil and gas, aviation, and manufacturing.",
    },
    about: {
      badge: "About us",
      heading: "From service provider to strategic digitalisation partner.",
      body: "We have a track record on complex projects for oil and gas (Pertamina), aviation, and manufacturing, covering HSSE digitalisation and operational command centres.",
      missionLabel: "Mission",
      mission:
        "To deliver adaptive, integrated technology solutions with real operational impact for our clients, through continuous innovation.",
      visionLabel: "Vision",
      vision:
        "To be the pioneer of AI-based digital solutions that improve efficiency and safety in industrial operations across Indonesia.",
    },
    stats: [
      { value: "2018", label: "Founded" },
      { value: "3", label: "Industry sectors" },
      { value: "10", label: "Projects delivered" },
    ],
    expertise: {
      badge: "Expertise",
      heading: "Three sectors, one way of working.",
      body: "Each sector has its own operational constraints. Open one to see the projects we have delivered in it.",
      sectors: sectorsEn,
    },
    products: {
      badge: "Products",
      heading: "Systems already running.",
      body: "Built for real operations, not for a demo.",
      items: [
        {
          id: "hsse",
          name: "Integrated HSSE System",
          blurb:
            "One system for digital inspection, pipeline visualisation, and an operational command centre. Available on desktop and field tablets.",
        },
        {
          id: "optigain",
          name: "OPTIGAIN",
          blurb:
            "Operational data analysis with an executive summary and AI recommendations, shown side by side against your own historical data.",
        },
        {
          id: "fire-truck",
          name: "Fire Truck Simulator",
          client: "Pertamina",
          blurb:
            "An interactive emergency response training simulation, used to drill teams without taking real appliances off the line.",
        },
      ],
      captureKinds: { film: "Product film", capture: "Screen recording" },
      playLabel: "Play",
    },
    contact: {
      badge: "Contact",
      heading: "Get in touch.",
      body: "Tell us about the one operational process giving your team the most trouble. We will map it with you and say plainly whether it is worth digitalising.",
      emailLabel: "Email",
      phoneLabel: "Phone",
    },
    footer: {
      rights: "All rights reserved.",
      builtIn: "Indonesia",
    },
  },
};

/** Named clients, cleared for public use. */
export const clients = [
  { name: "Pertamina", sector: "Oil and Gas" },
  { name: "JAS", sector: "Aviation" },
] as const;

/**
 * Titles are deliberately sector-neutral: the agency takes work across
 * industries, and naming energy in the title told both Google and a visitor
 * from any other sector that they were in the wrong place.
 *
 * The narrow terms that actually rank — "digitalisasi HSSE", "command center
 * operasional" — moved into the description rather than being dropped. The
 * title reads broad; the description stays findable.
 */
export const seo: Record<Locale, { title: string; description: string }> = {
  id: {
    title: "RTECH INDO — Digitalisasi operasi untuk industri Indonesia",
    description:
      "Software agency asal Indonesia sejak 2018. Digitalisasi HSSE, command center operasional, integrasi ERP, dan sistem berbasis AI. Lintas sektor.",
  },
  en: {
    title: "RTECH INDO — Digitalising operations for Indonesian industry",
    description:
      "An Indonesian software agency since 2018. HSSE digitalisation, operational command centres, ERP integration, and AI systems. Across sectors.",
  },
};
