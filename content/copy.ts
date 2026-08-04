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
 * Screen recordings of each system running, keyed by product id — the file
 * names in `public/video` already encoded this mapping.
 *
 * Locale-independent, so it sits here rather than in either dictionary. The
 * numbers are read out of the MP4 headers, not estimated: `seconds` from
 * `mvhd`, the aspect from `tkhd`. Every one of these is far past the 2 MB
 * autoplay budget in CLAUDE.md, so they are click-to-play and nothing but a
 * metadata range request happens until someone asks for one.
 */
export type ProductCapture = {
  src: string;
  /** Duration in seconds, read from the container. */
  seconds: number;
};

export const productCaptures: Record<string, ProductCapture> = {
  hsse: { src: "/video/hsse.mp4", seconds: 58.5 },
  optigain: { src: "/video/optigain.mp4", seconds: 43.1 },
  "fire-truck": { src: "/video/fire-truck.mp4", seconds: 20 },
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
    /** Label on the still frame, e.g. "Screen recording". */
    captureLabel: string;
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
      "AI Warehouse Management System",
      "AI Recruitment Agent",
      "AI Cargo Execution System",
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
      badge: "Sejak 2018 — Oil & Gas, Aviation, Manufaktur",
      headline: "Digitalisasi operasi kritikal, dari HSSE sampai command center.",
      // Verbatim from the deck, slide "Tentang Kami".
      standfirst:
        "Berdiri sejak 2018 sebagai software agency yang berfokus pada solusi kritikal di industri Oil & Gas. Kami telah bertransformasi dari penyedia layanan menjadi mitra strategis digitalisasi.",
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
      body: "Kami memiliki rekam jejak dalam menangani proyek-proyek kompleks untuk Oil & Gas (Pertamina), Aviation (CAS), dan manufaktur, mencakup digitalisasi HSSE dan Command Center operasional.",
      missionLabel: "Misi",
      // Verbatim from the deck.
      mission:
        "Memberikan solusi teknologi yang adaptif, terintegrasi, dan berdampak nyata bagi operasional klien melalui inovasi berkelanjutan.",
      visionLabel: "Visi",
      // Verbatim from the deck.
      vision:
        "Menjadi pionir solusi digital berbasis AI yang mengoptimalkan efisiensi dan keamanan di industri energi nasional.",
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
      captureLabel: "Rekaman layar",
      playLabel: "Putar rekaman",
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
      badge: "Since 2018 — oil & gas, aviation, manufacturing",
      headline: "Digitalising critical operations, from HSSE to the command centre.",
      standfirst:
        "Founded in 2018 as a software agency focused on critical solutions in oil and gas. We have grown from a service provider into a strategic digitalisation partner.",
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
      body: "We have a track record on complex projects for oil and gas (Pertamina), aviation (CAS), and manufacturing, covering HSSE digitalisation and operational command centres.",
      missionLabel: "Mission",
      mission:
        "To deliver adaptive, integrated technology solutions with real operational impact for our clients, through continuous innovation.",
      visionLabel: "Vision",
      vision:
        "To be the pioneer of AI-based digital solutions that improve efficiency and safety in Indonesia's national energy industry.",
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
      captureLabel: "Screen recording",
      playLabel: "Play recording",
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
  { name: "CAS", sector: "Aviation" },
] as const;

export const seo: Record<Locale, { title: string; description: string }> = {
  id: {
    title: "RTECH INDO — Digitalisasi operasi kritikal untuk industri energi",
    description:
      "Software agency asal Indonesia sejak 2018. Digitalisasi HSSE, command center operasional, integrasi ERP, dan sistem berbasis AI untuk Oil & Gas, Aviation, dan manufaktur.",
  },
  en: {
    title: "RTECH INDO — Digitalising critical operations for energy",
    description:
      "An Indonesian software agency since 2018. HSSE digitalisation, operational command centres, ERP integration, and AI systems for oil and gas, aviation, and manufacturing.",
  },
};
