import type { StaticImageData } from "next/image";

import fireTruckPoster from "@/public/image/capture-fire-truck.webp";
import hssePoster from "@/public/image/capture-hsse.webp";
import optigainPoster from "@/public/image/capture-optigain.webp";
import jasLogo from "@/public/logos/jas.png";
import pertaminaLogo from "@/public/logos/pertamina.svg";

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
 *
 * ## House style for this file
 *
 * The copy was rewritten on the client's instruction to stop sounding
 * machine-written. Four habits caused that and they are easy to fall back into:
 *
 * 1. **Em-dashes.** There were twelve on the page. They are the single loudest
 *    tell. Use a full stop or a colon. Two on the whole site is plenty.
 * 2. **Uniform sentence length.** Every sentence landing at fifteen to twenty
 *    words reads as generated. Vary it hard: a three-word sentence next to a
 *    thirty-word one is what human writing actually looks like.
 * 3. **Balanced triads.** "Adaptive, integrated, and impactful." Three parallel
 *    adjectives in a row is a template, not a thought. Two is usually enough,
 *    and unequal items are better than matched ones.
 * 4. **"Not X, but Y."** "Built for real operations, not for a demo." It scans
 *    well once and reads as a tic by the third time.
 *
 * Concrete beats abstract every time. "Orang lapangan yang hafal jalan
 * pintasnya" does more work than "operational inefficiencies", and an ops
 * director recognises themselves in it.
 *
 * Banned words are in CLAUDE.md. `mission` and `vision` below are deck-verbatim
 * and were deliberately left in their original register.
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
 * One stage of an engagement. The four stages are the client's own, given in
 * this order: initiation, MVP / solution discussion, development, testing and
 * delivery.
 *
 * A stage is exactly two lists and a name. `deliverables` is what leaves our
 * hands at the end of it; `needs` is what we need from the client's side to
 * finish it — stated because a stage that quietly depends on the buyer's time
 * is the stage that slips, and saying so up front is the honest version of a
 * process diagram.
 *
 * There was a `summary` paragraph per stage. It is gone at the client's
 * request: four stages each carrying a 45-word paragraph plus two lists made a
 * section nobody would read to the end. The narrative it carried now lives once,
 * in the section intro and the closing line, instead of four times in the cards.
 * The removed copy is in git if any of it is ever wanted back.
 *
 * There is deliberately no duration field. No timeline appears anywhere in the
 * deck, and CLAUDE.md forbids inventing a number — an invented "2 weeks" on a
 * process section is exactly the kind of figure a skeptical ops director checks.
 */
export type Phase = {
  id: string;
  name: string;
  deliverables: string[];
  needs: string;
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
  "hsse-ai": {
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
  process: {
    badge: string;
    heading: string;
    body: string;
    /** Prefixes the stage index for screen readers: "Stage 2 of 4". */
    phaseLabel: string;
    of: string;
    deliverablesLabel: string;
    needsLabel: string;
    /** Sits on the rail between two stages. */
    gateLabel: string;
    phases: Phase[];
    /** The closing line under the rail — the reason the gates are there. */
    closing: string;
  };
  /**
   * `countUp` marks a figure that is genuinely a quantity, and so can sensibly
   * animate up from zero. The founding year is deliberately false: 2018 was
   * never a count, and on a page arguing that we do not inflate numbers, a year
   * spinning like an odometer is the wrong note.
   */
  stats: { value: string; label: string; countUp?: boolean }[];
  expertise: {
    badge: string;
    heading: string;
    body: string;
    sectors: Sector[];
    /**
     * Noun for "how many projects are inside this sector", inflected.
     * Indonesian does not mark plural, so both forms are the same word — the
     * shape exists so English cannot silently render "1 Projects" if a sector
     * ever drops to one project.
     */
    projectCount: { one: string; other: string };
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
    /** Introduces the client on the banner across the top of a product's frame. */
    clientLabel: string;
  };
  contact: {
    badge: string;
    heading: string;
    body: string;
    emailLabel: string;
    phoneLabel: string;
    /** What the half hour is actually like. Sets expectations, lowers the bar. */
    reassurance: string[];
  };
  footer: {
    rights: string;
    navLabel: string;
    contactLabel: string;
    officesLabel: string;
  };
};

/** Shared across locales — these are proper nouns, not translatable copy. */
export const contact = {
  email: "info@rtechindo.com",
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
      "AI HSE Digital Inspection",
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
      "AI HSE Digital Inspection",
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

/**
 * The four stages, written in the first person and addressed to one person
 * rather than to "organisations". Nothing here is a claim about speed, price,
 * or outcome — only about what happens, in what order, and who has to be in the
 * room. That is the part a buyer who has watched a pilot die actually wants.
 */
const phasesId: Phase[] = [
  {
    id: "initiation",
    name: "Inisiasi",
    deliverables: [
      "Analisa proses bisnis dan pain point dari client",
      "Membuat ruang lingkup project, termasuk yang tidak kami kerjakan",
      "Daftar risiko dan asumsi",
    ],
    needs: "Satu orang di pihak Anda yang paling paham prosesnya.",
  },
  {
    id: "mvp",
    name: "Diskusi solusi dan MVP",
    deliverables: [
      "MVP yang siap dicoba tim Anda",
      "Rancangan arsitektur dan alur data",
      "Keputusan penempatan data: di server Anda atau di cloud",
    ],
    needs: "Waktu beberapa jam dari tim yang akan memakainya, untuk mencoba dan mengatakan apa yang salah.",
  },
  {
    id: "development",
    name: "Pengembangan",
    deliverables: [
      "Pembuatan sistem sesuai dengan kebutuhan",
      "Integrasi ke ERP dan sumber data lapangan jika dibutuhkan",
      "Dokumentasi teknis yang ditulis sambil jalan",
    ],
    needs: "Akses ke sistem yang akan disambung, dan satu narahubung teknis.",
  },
  {
    id: "delivery",
    name: "Testing dan Delivery",
    deliverables: [
      "Melaksanakan testing oleh user di lokasi kerja",
      "Pelatihan teknis dan non teknis untuk tim anda",
      "Serah terima kode, infrastruktur, dan dokumentasi",
    ],
    needs: "Beberapa pengguna untuk menguji, dan jadwal untuk pelatihan.",
  },
];

const phasesEn: Phase[] = [
  {
    id: "initiation",
    name: "Initiation",
    deliverables: [
      "Business analysis of the current process and client pain points",
      "Scope definition, including what we will not build",
      "A list of risks and assumptions",
    ],
    needs: "One person on your side who knows the process best.",
  },
  {
    id: "mvp",
    name: "Solution discussion and MVP",
    deliverables: [
      "An MVP your team can try",
      "Architecture and data flow design",
      "A decision on where data sits: your servers or the cloud",
    ],
    needs: "A few hours from the team who will use it, to try it and tell us what is wrong.",
  },
  {
    id: "development",
    name: "Development",
    deliverables: [
      "System development according to requirements",
      "Integration with the ERP and field data sources if needed",
      "Technical documentation written as we go",
    ],
    needs: "Access to the systems we connect to, and one technical contact.",
  },
  {
    id: "delivery",
    name: "Testing and delivery",
    deliverables: [
      "User testing where the work actually happens",
      "Training for the people who use it and the people who maintain it",
      "Handover of code, infrastructure, and documentation",
    ],
    needs: "A few real users to test with, and time on the calendar for training.",
  },
];

export const copy: Record<Locale, Dict> = {
  id: {
    nav: [
      { label: "Tentang kami", href: "#tentang" },
      { label: "Keahlian", href: "#keahlian" },
      { label: "Produk", href: "#produk" },
      { label: "Cara kerja", href: "#cara-kerja" },
      { label: "Hubungi kami", href: "#kontak" },
    ],
    hero: {
      badge: "Software agency Indonesia, sejak 2018",
      // Still carries "digitalisasi" and "operasi", the two terms this page
      // ranks on. What changed is that it now states a constraint the reader
      // lives with instead of describing a service category.
      headline: "Digitalisasi untuk operasi yang tidak boleh berhenti.",
      // NOT verbatim from the deck. The deck line scoped the agency to Oil &
      // Gas; that was costing cross-sector enquiries, so it was reworded with
      // the client's explicit approval on 2026-08-10. Oil & Gas is still where
      // the work started, not the limit of it, and the three sectors named are
      // the three actually delivered. No others implied.
      standfirst:
        "Kami mulai di Oil & Gas. Lalu Aviation, lalu manufaktur. Industrinya beda, polanya sama: proses yang masih manual, data yang tercecer di banyak tempat, dan orang lapangan yang sudah terlanjur hafal jalan pintasnya.",
      mediaDescription:
        "Unit komputasi yang kami sesuaikan dengan kebutuhan klien.",
      panelTitle: "Integrated HSSE System",
      panelBody:
        "Inspeksi digital, visualisasi jalur pipa, command center. Satu sistem, jalan di server Anda sendiri.",
    },
    cta: {
      primary: "Jadwalkan sesi scoping",
      secondary: "Lihat yang sudah kami kerjakan",
      href: pending("URL penjadwalan: Cal.com, Calendly, atau rute formulir"),
    },
    clients: {
      label: "Dipercaya oleh",
      note: "Dua klien yang namanya boleh kami sebut. Sektornya: Oil & Gas, Aviation, dan manufaktur.",
    },
    process: {
      badge: "Cara kerja",
      heading: "Empat tahap, dan Anda boleh berhenti di antaranya.",
      body: "Hampir semua tim yang kami temui punya cerita yang sama. Ada proyek AI. Ada anggarannya. Tidak pernah sampai ke tangan operator. Empat tahap ini dibuat supaya Anda selalu tahu posisinya dan mencoba langsung.",
      phaseLabel: "Tahap",
      of: "dari",
      deliverablesLabel: "Yang Anda terima",
      needsLabel: "Yang kami butuhkan dari Anda",
      gateLabel: "Lanjut / berhenti",
      phases: phasesId,
      // Carries the handover claim, which used to live in the stage summaries
      // before those were cut. It is the strongest differentiator on the page,
      // so it cannot be the thing that quietly disappears.
      closing:
        "",
        // "Di setiap batas tahap ada satu pertanyaan: lanjut atau berhenti? Kalau berhenti, semua yang sudah jadi tetap milik Anda. Kode, dokumentasi, hasil pemetaan. Tidak ada yang kami tahan.",
    },
    about: {
      badge: "Tentang kami",
      heading: "Kami membantu anda dalam implementasi sistem hingga benar-benar dipakai.",
      body: "Sejak 2018 kami mengerjakan proyek untuk industri di Oil & Gas, lalu masuk ke Aviation dan manufaktur. Isinya digitalisasi HSSE, integrasi ERP, sampai command center yang berdampak langsung ke lapangan dan head office.",
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
      { value: "3", label: "Sektor industri", countUp: true },
      { value: "10", label: "Proyek dalam portofolio", countUp: true },
    ],
    expertise: {
      badge: "Keahlian",
      heading: "Tiga sektor, satu cara kerja.",
      // No longer "buka masing-masing": the three columns open by default, so an
      // instruction to open them described a page that no longer exists.
      body: "Kendalanya beda-beda tiap sektor. Yang di bawah ini semuanya sudah kami kerjakan, bukan rencana.",
      sectors: sectorsId,
      projectCount: { one: "Proyek", other: "Proyek" },
    },
    products: {
      badge: "Produk",
      heading: "Sistem yang sudah berjalan.",
      body: "Kami tidak membangun sistem untuk demo. Semua yang di bawah ini sudah dipakai di lapangan, dan masih dipakai sampai sekarang.",
      items: [
        {
          id: "hsse",
          name: "Integrated Fire Readiness System",
          client: "Pertamina",
          blurb:
            "Satu sistem untuk inspeksi digital kesiapan equipment untuk pemadaman kebakaran. Tersedia di desktop dan tablet lapangan.",
        },
        {
          id: "hsse-ai",
          name: "Integrated HSSE",
          client: "Pertamina",
          blurb:
            "Pengembangan lanjutan dari sistem sebelumnya untuk inspeksi HSSE secara digital dengan bantuan AI untuk membangun checklist, visualisasi jalur pipa, dan command center operasional. Tersedia di desktop dan tablet lapangan.",
        },
        {
          id: "optigain",
          name: "OPTIGAIN",
          client: "Manufaktur",
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
      clientLabel: "Klien",
    },
    contact: {
      badge: "Hubungi kami",
      heading: "Mulai dari satu proses yang paling merepotkan.",
      body: "Yang mana pun. Yang antriannya paling panjang, yang paling sering salah, atau yang cuma satu orang di kantor yang benar-benar paham. Kami petakan bareng, lalu kami bilang apa adanya: layak didigitalisasi, atau belum.",
      emailLabel: "Email",
      phoneLabel: "Telepon",
      reassurance: [
        "Tiga puluh menit. Yang datang orang teknis, bukan sales.",
        "Tidak ada presentasi produk. Kami lebih banyak bertanya daripada bicara.",
        "Kalau belum layak dibangun sekarang, kami bilang begitu.",
      ],
    },
    footer: {
      rights: "Seluruh hak cipta dilindungi.",
      navLabel: "Halaman",
      contactLabel: "Kontak",
      officesLabel: "Wilayah kerja",
    },
  },

  en: {
    nav: [
      { label: "About", href: "#tentang" },
      { label: "Expertise", href: "#keahlian" },
      { label: "Products", href: "#produk" },
      { label: "How we work", href: "#cara-kerja" },
      { label: "Contact", href: "#kontak" },
    ],
    hero: {
      badge: "An Indonesian software agency, since 2018",
      headline: "Digitalising operations that are not allowed to stop.",
      standfirst:
        "We started in oil and gas. Then aviation, then manufacturing. Different industries, same pattern underneath: processes still done by hand, data scattered across a dozen places, and people on the floor who long ago learned the workarounds.",
      mediaDescription:
        "A compute unit as what our client needs",
      panelTitle: "Integrated HSSE System",
      panelBody:
        "Digital inspection, pipeline visualisation, command centre. One system, running on your own servers.",
    },
    cta: {
      primary: "Book a scoping call",
      secondary: "See what we have built",
      href: pending("Booking URL: Cal.com, Calendly, or a form route"),
    },
    clients: {
      label: "Trusted by",
      note: "Two clients we are able to name. The sectors: oil and gas, aviation, manufacturing.",
    },
    process: {
      badge: "How we work",
      heading: "Four stages, and you can stop between any of them.",
      body: "Nearly every team we meet tells the same story. There was an AI project. There was a budget. It never reached an operator. These four stages exist so you always know where you stand and do live trial from the MVP for a better overview.",
      phaseLabel: "Stage",
      of: "of",
      deliverablesLabel: "What you get",
      needsLabel: "What we need from you",
      gateLabel: "Go / stop",
      phases: phasesEn,
      closing:
        "",
        // "At every boundary there is one question: continue or stop? If you stop, everything already built stays yours. The code, the documentation, the process map. We hold nothing back.",
    },
    about: {
      badge: "About us",
      heading: "We help you implement systems until they are genuinely being used.",
      body: "Since 2018 we have worked with in oil and gas industry, then moved into aviation and manufacturing. HSSE digitalisation, ERP integration, and command centres that have a direct impact on operations.",
      missionLabel: "Mission",
      mission:
        "To deliver adaptive, integrated technology solutions with real operational impact for our clients, through continuous innovation.",
      visionLabel: "Vision",
      vision:
        "To be the pioneer of AI-based digital solutions that improve efficiency and safety in industrial operations across Indonesia.",
    },
    stats: [
      { value: "2018", label: "Founded" },
      { value: "3", label: "Industry sectors", countUp: true },
      { value: "10", label: "Projects delivered", countUp: true },
    ],
    expertise: {
      badge: "Expertise",
      heading: "Three sectors, one way of working.",
      body: "The constraints differ by sector. Everything listed below has been built, not proposed.",
      sectors: sectorsEn,
      projectCount: { one: "Project", other: "Projects" },
    },
    products: {
      badge: "Products",
      heading: "Systems already running.",
      body: "We are not build a demo system. All on this sample below is the system that already build and operate untill now.",
      items: [
        {
          id: "hsse",
          name: "Integrated HSSE System",
          client: "Pertamina",
          blurb:
            "One system for digital inspection for fire readiness equipment. Available on desktop and field tablets.",
        },
        {
          id: "hsse-ai",
          name: "Integrated HSSE System with AI",
          client: "Pertamina",
          blurb:
            "An improvement from previous version digital inspection with AI for checklist generation and maintenance, pipeline visualisation, and an operational command centre. Available on desktop and field tablets.",
        },
        {
          id: "optigain",
          name: "OPTIGAIN",
          client: "Manufacture",
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
      clientLabel: "Client",
    },
    contact: {
      badge: "Contact",
      heading: "Start with the one process that causes the most trouble.",
      body: "Any of them. The one with the longest queue, the one that goes wrong most often, or the one only a single person in the office really understands. We will map it with you, then tell you straight: worth digitalising, or not yet.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      reassurance: [
        "Thirty minutes. An engineer turns up, not a salesperson.",
        "No product pitch. We ask more than we talk.",
        "If it is not worth building yet, we will say so.",
      ],
    },
    footer: {
      rights: "All rights reserved.",
      navLabel: "Pages",
      contactLabel: "Contact",
      officesLabel: "Where we work",
    },
  },
};

/**
 * Named clients, cleared for public use.
 *
 * The logos are the companies' own published marks, not redrawn: Pertamina's
 * from Wikimedia Commons, JAS Airport Services' from ptjas.co.id. CLAUDE.md
 * forbids fabricating a client logo, and a hand-traced approximation of someone
 * else's trademark is a fabrication — so these are the real files or nothing.
 *
 * `wordmark` is what the mark actually spells, which is not always the short
 * name: it becomes the alt text and the visible label under the mark.
 */
export type Client = {
  name: string;
  wordmark: string;
  sector: string;
  logo: StaticImageData;
  /** Rendered height in px. Set per mark so the two optically match rather than
   *  sharing a height, which would leave the taller lockup looking oversized. */
  height: number;
};

export const clients: Client[] = [
  {
    name: "Pertamina",
    wordmark: "Pertamina",
    sector: "Oil and Gas",
    logo: pertaminaLogo,
    height: 26,
  },
  {
    name: "JAS",
    wordmark: "JAS Airport Services",
    sector: "Aviation",
    logo: jasLogo,
    height: 34,
  },
];

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
