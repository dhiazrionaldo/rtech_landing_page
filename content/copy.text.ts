import { pending, type Fillable } from "./pending.ts";
import type { Locale } from "./i18n.ts";

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
 * The copy has been through two passes to stop it sounding machine-written.
 *
 * The first pass killed the surface tells. Those rules still hold:
 *
 * 1. **Em-dashes.** There were twelve on the page. They are the single loudest
 *    tell. Use a full stop or a colon. Two on the whole site is plenty.
 * 2. **Uniform sentence length.** Every sentence landing at fifteen to twenty
 *    words reads as generated. Vary it hard.
 * 3. **Balanced triads.** "Adaptive, integrated, and impactful." Three parallel
 *    adjectives in a row is a template, not a thought.
 * 4. **"Not X, but Y."** It scans well once and reads as a tic by the third
 *    time.
 *
 * The page still read as machine-written after that, because the tells that
 * were left are structural rather than lexical. The second pass fixed four
 * more, and these are the ones easiest to undo by accident:
 *
 * 5. **One section shape, repeated.** Every section was badge, then heading,
 *    then a body paragraph averaging thirty-one words. Five identical units in
 *    a row is the shape a reader recognises as generated, whatever the words
 *    say. Two sections now open on the heading alone: `expertise` and
 *    `products` have no `body` at all, and `SectionHeader` widens the heading
 *    to fill the measure when none is passed. Do not "helpfully" add them back.
 * 6. **Everything came in threes.** Three pains in the standfirst, three
 *    processes in the contact body, three reassurance lines, three deliverables
 *    per stage. Counts that are real facts stay at three (three sectors, three
 *    stats). Rhetorical lists are now two, or one.
 * 7. **One cadence for every heading.** "Three sectors, one way of working." /
 *    "Four stages, and you can stop between any of them." Fragment, comma,
 *    reversal — in the headline and three section headings at once. Each
 *    heading now has its own grammatical shape.
 * 8. **Performed candour.** "An engineer turns up, not a salesperson." "We'll
 *    tell you straight." "If it's not worth building yet, we'll say so." One of
 *    those is credible. Three stacked is a formula, and it is the current
 *    generation of AI-agency template. `reassurance` is one line now, and it
 *    states a fact rather than a virtue.
 *
 * The English was separately rewritten because it contained real errors ("We
 * are not build a demo system", "we have worked with in oil and gas industry")
 * that read as machine translation, which lands worse than machine authorship.
 *
 * Total body prose is held to roughly 300 words across the page, down from
 * about 600. If a change pushes it back up, something else has to come out.
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
  /** URL segment for /work/[slug]. Stable; changing one breaks a live URL. */
  slug: string;
  name: string;
  client?: string;
  /** Sector as it appears on the card's metadata strip. */
  sector: string;
  status: "in-production" | "delivered";
  year: number;
  stack: string[];
  blurb: string;
  /**
   * Quantified outcomes. `pending()` until the client supplies real figures.
   * CLAUDE.md: never invent or inflate a number — an unfilled metric is a
   * type-level fact here and can never render as a visible placeholder.
   */
  metrics?: { label: string; value: Fillable }[];
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
 * `deliverables` is capped at two per stage. It was three, which put twelve
 * bullets plus four paragraphs on screen at once and made the section a wall
 * nobody finished. Three items per card also meant the section was built
 * entirely out of triads, which is tell #6 above.
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

type Dict = {
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    headline: string;
    subline: string;
    mediaDescription: string;
    /**
     * The 3D object in the hero is decorative and its canvas is aria-hidden, so
     * what it depicts has to exist as crawlable text. This is that text.
     */
    architectureDescription: string;
  };
  rails: {
    capabilities: string;
    work: string;
    industries: string;
    prev: string;
    next: string;
    inProduction: string;
    delivered: string;
  };
  cta: {
    primary: string;
    secondary: string;
    href: Fillable;
  };
  /**
   * No `note` any more. It read "Two clients we are able to name", which is a
   * sentence explaining a picture that already explains itself, directly under
   * the picture.
   */
  clients: { label: string };
  about: {
    badge: string;
    heading: string;
    body: string;
    /** Label above the team roster folded into this section. */
    teamLabel: string;
    missionLabel: string;
    mission: string;
    /**
     * Rendered again, beside `mission`, at the client's request.
     *
     * It was pulled from the page during the word-budget pass: the pair is 34
     * words of institutional register on a page whose argument is directness,
     * and it was the largest single block between the page and its target. That
     * was a rendering decision only. Neither string has ever been reworded —
     * CLAUDE.md forbids editing the deck-verbatim copy without asking — so the
     * text here is what it always was.
     *
     * If the budget ever needs the words back, cut something else: the client
     * has now asked for this pair specifically.
     */
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
    items: Product[];
    /** What the asset is, keyed by `ProductCapture["kind"]`. */
    captureKinds: Record<"film" | "capture", string>;
    /** Prefixes the product name to name the play control for screen readers. */
    playLabel: string;
    /** Introduces the client on the banner across the top of a product's frame. */
    clientLabel: string;
  };
  team: {
    members: TeamMember[];
  };
  contact: {
    badge: string;
    heading: string;
    body: string;
    emailLabel: string;
    phoneLabel: string;
    /**
     * One line, not three. What the half hour is actually like, stated as a
     * fact about who is in the room rather than as a promise about our
     * character.
     */
    reassurance: string;
  };
  footer: {
    /** One line under the wordmark. Not the billboard eyebrow: this is a
     *  descriptor for someone who has read the whole page, not a scannable
     *  tag above a headline. */
    tagline: string;
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
    discipline: "Digitalisasi HSSE dan command center operasional",
    projects: [
      "AI HSE Digital Inspection",
      "Water Line Piping Visualization & Command Center",
      "Fire Truck Simulator",
    ],
  },
  {
    id: "aviation",
    name: "Aviation",
    discipline: "Integrasi ERP, kargo, dan operasional",
    projects: [
      "Lounge Management System",
      "Cargo Policy & Procedure AI Agent",
      "Baggage Reconciliation System",
    ],
  },
  {
    id: "manufacture",
    name: "Manufacture",
    discipline: "Integrasi ERP dan warehouse management",
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
    discipline: "HSSE digitalisation and operational command centres",
    projects: [
      "AI HSE Digital Inspection",
      "Water Line Piping Visualization & Command Center",
      "Fire Truck Simulator",
    ],
  },
  {
    id: "aviation",
    name: "Aviation",
    discipline: "ERP, cargo, and operations integration",
    projects: [
      "AI Warehouse Management System",
      "AI Recruitment Agent",
      "AI Cargo Execution System",
    ],
  },
  {
    id: "manufacture",
    name: "Manufacture",
    discipline: "ERP integration and warehouse management",
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
      "Analisa proses bisnis dan pain point",
      "Ruang lingkup, termasuk yang tidak kami kerjakan",
    ],
    needs: "Satu orang yang paling paham prosesnya.",
  },
  {
    id: "mvp",
    name: "Diskusi solusi dan MVP",
    deliverables: [
      "MVP yang siap dicoba tim Anda",
      "Penempatan data: server Anda atau cloud",
    ],
    needs: "Beberapa jam dari tim yang akan memakainya.",
  },
  {
    id: "development",
    name: "Pengembangan",
    deliverables: [
      "Integrasi ke ERP dan sumber data lapangan",
      "Dokumentasi teknis yang ditulis sambil jalan",
    ],
    needs: "Akses sistem dan satu narahubung teknis.",
  },
  {
    id: "delivery",
    name: "Testing dan delivery",
    deliverables: [
      "Pelatihan untuk pengguna dan tim teknis",
      "Serah terima kode, infrastruktur, dan dokumentasi",
    ],
    needs: "Beberapa pengguna untuk menguji, dan jadwal pelatihan.",
  },
];

const phasesEn: Phase[] = [
  {
    id: "initiation",
    name: "Initiation",
    deliverables: [
      "Analysis of the current process and its pain points",
      "Scope, including what we will not build",
    ],
    needs: "One person who knows the process best.",
  },
  {
    id: "mvp",
    name: "Solution and MVP",
    deliverables: [
      "An MVP your team can try",
      "A decision on where data sits: your servers or the cloud",
    ],
    needs: "A few hours from the team who will use it.",
  },
  {
    id: "development",
    name: "Development",
    deliverables: [
      "Integration with your ERP and field data sources",
      "Technical documentation written as we go",
    ],
    needs: "System access and one technical contact.",
  },
  {
    id: "delivery",
    name: "Testing and delivery",
    deliverables: [
      "Training for the people who use it and the people who maintain it",
      "Handover of code, infrastructure, and documentation",
    ],
    needs: "A few real users, and time on the calendar.",
  },
];

/**
 * The people on the team.
 *
 * `role` and `bio` are locale-specific, so the roster follows the same shape as
 * `phases` above: one array per language, referenced from each dictionary.
 * `name` is a proper noun and identical in both.
 *
 * ## On photographs
 *
 * `photo` is optional and currently unset for both members, which renders them
 * as initials.
 *
 * It is unset on purpose. The request was to source a stock photograph of a
 * woman for the CEO and a man for the CTO. Attaching a stranger's face to a
 * named, real person is not a placeholder that gets corrected later — it is a
 * false claim about who these people are, published under their own names, and
 * one of them cannot consent to it through the other. It also sits on a page
 * whose entire argument is that nothing here is inflated.
 *
 * Drop real files into `public/image/team/` and set `photo` on each member. The
 * component already handles both states; nothing else has to change.
 */
export type TeamMember = {
  id: string;
  /** Proper noun. Identical across locales. */
  name: string;
  role: string;
  /** One line of standing. Kept short: this is a card, not a CV. */
  bio: string;
  /** Path under `public/`, e.g. `/image/team/dhiaz.webp`. Real photographs only. */
  photo?: string;
};

/**
 * Founder first, co-founder second, which is the order the two titles imply.
 * Swapping them is a one-line change in both arrays.
 */
const teamId: TeamMember[] = [
  {
    id: "dhiaz",
    name: "Dhiaz Rionaldo",
    role: "Founder & CTO",
    bio: "Sepuluh tahun lebih di industri IT. Sekarang fokus membangun sistem AI agentic.",
  },
  {
    id: "ariela",
    name: "Ariela Oktafira",
    role: "Co-founder & CEO",
    bio: "Sepuluh tahun lebih sebagai konsultan manajemen bisnis.",
  },
];

const teamEn: TeamMember[] = [
  {
    id: "dhiaz",
    name: "Dhiaz Rionaldo",
    role: "Founder & CTO",
    bio: "Over ten years in the IT industry. Now building agentic AI systems.",
  },
  {
    id: "ariela",
    name: "Ariela Oktafira",
    role: "Co-founder & CEO",
    bio: "Over ten years in business management consulting.",
  },
];

export const copy: Record<Locale, Dict> = {
  id: {
    nav: [
      { label: "Layanan", href: "#keahlian" },
      { label: "Portofolio", href: "#produk" },
      { label: "Industri", href: "#industri" },
      { label: "Cara kerja", href: "#cara-kerja" },
      { label: "Kontak", href: "#kontak" },
    ],
    hero: {
      eyebrow: "Sistem AI untuk industri Indonesia · Sejak 2018",
      headline: "Operasi yang tidak boleh berhenti.",
      subline:
        "AI agent, aplikasi custom, dan integrasi ERP untuk industri Indonesia. Termasuk perangkat kerasnya.",
      mediaDescription:
        "Rekaman layar sistem yang dibangun RTECH INDO dan sudah berjalan: inspeksi kesiapan pemadam kebakaran, command centre HSSE, otomasi pemilihan vendor, dan simulator tanggap darurat kebakaran.",
      architectureDescription:
        "Diagram sistem yang kami bangun: ERP dan HRIS mengalir ke lapisan integrasi, yang menjalankan agen AI dan model prediksi, keduanya melapor ke tablet lapangan. Seluruh sistem berjalan di server milik klien sendiri.",
    },
    rails: {
      capabilities: "Yang kami bangun",
      work: "Sistem yang sudah berjalan",
      industries: "Industri yang kami kenal",
      prev: "Geser ke kiri",
      next: "Geser ke kanan",
      inProduction: "Sudah berjalan",
      delivered: "Selesai",
    },
    cta: {
      primary: "Jadwalkan sesi scoping",
      secondary: "Lihat yang sudah kami bangun",
      href: pending("URL penjadwalan: Cal.com, Calendly, atau rute formulir"),
    },
    clients: {
      label: "Dipercaya oleh",
    },
    process: {
      badge: "Cara kerja",
      // Was "Fase project kami melalui 4 tahapan ini.": ungrammatical (a
      // singular "fase" cannot "melalui" four stages) and used the English
      // spelling "project" where the rest of the Indonesian copy says
      // "proyek". Rewritten to mirror the English heading's fragment-comma
      // shape (tell #7) rather than translated word for word.
      heading: "Empat tahapan, dan Anda bisa berhenti setelah tahap mana pun.",
      // This was the `closing` line, commented out and unrendered. It is the
      // strongest differentiator on the page, so it is now the section body and
      // the long "every team tells the same story" paragraph it replaced is
      // gone. 50 words to 13.
      body: "",
      phaseLabel: "Tahap",
      of: "dari",
      deliverablesLabel: "Yang Anda terima",
      needsLabel: "Yang kami butuhkan",
      gateLabel: "Lanjut / berhenti",
      phases: phasesId,
    },
    about: {
      badge: "Tentang kami",
      heading: "Kami baru selesai kalau sistemnya benar-benar dipakai.",
      body: "Sejak 2018: digitalisasi HSSE, integrasi ERP, command center, hingga Agentic AI yang membantu bisnis dan operasional klien kami.",
      teamLabel: "Yang akan menangani proyek Anda",
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
      // No body. This section opens on the heading alone — see tell #5.
      heading: "Di mana kami sudah bekerja.",
      sectors: sectorsId,
      projectCount: { one: "Proyek", other: "Proyek" },
    },
    products: {
      badge: "Proyek sebelumnya",
      // No body. The claim the old body carried ("we do not build systems for
      // demos") is now in the heading, in four fewer words.
      heading: "Solusi yang telah kami kembangkan untuk klien kami.",
      items: [
        {
          id: "hsse-ai",
          slug: "integrated-hsse",
          name: "Integrated HSSE",
          client: "Pertamina",
          sector: "Minyak dan Gas",
          status: "in-production",
          year: 2024,
          stack: ["Next.js", "Python", "Computer vision", "On-premise"],
          blurb:
            "Checklist dibuat AI, visualisasi jalur pipa, dan command center operasional.",
        },
        {
          id: "hr-agent",
          slug: "hr-recruitment-agent",
          name: "HR Recruitment Agent",
          client: "JAS Airport Services",
          sector: "Aviasi",
          status: "in-production",
          year: 2025,
          stack: ["Agentic AI", "ERP", "HRIS"],
          blurb:
            "Agen AI yang membantu tim rekrutmen internal menemukan kandidat terbaik, lebih cepat dan akurat. Terintegrasi dengan sistem ERP dan HRIS perusahaan, dan bisa diakses lewat web maupun aplikasi mobile.",
        },
        {
          id: "optigain",
          slug: "optigain",
          name: "OPTIGAIN",
          client: "Manufaktur",
          sector: "Manufaktur",
          status: "delivered",
          year: 2024,
          stack: ["Forecasting", "Dashboard", "Python"],
          blurb:
            "Analisis data sales dengan ringkasan eksekutif dan rekomendasi AI.",
        },
        {
          id: "fire-truck",
          slug: "fire-truck-simulator",
          name: "Fire Truck Simulator",
          client: "Pertamina",
          sector: "Minyak dan Gas",
          status: "delivered",
          year: 2023,
          stack: ["Simulation", "3D", "Training"],
          blurb:
            "Simulasi tanggap darurat kebakaran, tanpa menurunkan armada sungguhan.",
        },
        {
          id: "FIFO",
          slug: "fifo-vendor-selection",
          name: "FIFO - Vendor Selection Automation",
          client: "JAS Airport Services",
          sector: "Aviasi",
          status: "in-production",
          year: 2025,
          stack: ["Agentic AI", "Procurement", "ERP"],
          blurb:
            "Solusi AI untuk seleksi vendor dan proses pengadaan, mempercepat dan mempertajam pengambilan keputusan.",
        },
        {
          id: "hsse",
          slug: "fire-readiness-system",
          name: "Integrated Fire Readiness System",
          client: "Pertamina",
          sector: "Minyak dan Gas",
          status: "in-production",
          year: 2023,
          stack: ["Next.js", "Tablet", "Offline-first"],
          blurb:
            "Inspeksi digital kesiapan peralatan pemadam kebakaran. Desktop dan tablet lapangan.",
        },
      ],
      captureKinds: { film: "Video produk", capture: "Rekaman layar" },
      playLabel: "Putar",
      clientLabel: "Klien",
    },
    team: {
      members: teamId,
    },
    contact: {
      badge: "Hubungi kami",
      heading: "Mulai dari proses yang paling penting.",
      body: "Setiap bisnis memiliki proses yang memakan terlalu banyak waktu, menimbulkan biaya yang tidak perlu, atau sangat bergantung pada pekerjaan manual. Dari situlah kami memulai. Kami bekerja sama secara erat dengan tim Anda untuk memahami bagaimana proses tersebut berjalan, mengidentifikasi hal-hal yang menghambat bisnis, serta menentukan di mana teknologi dapat memberikan dampak terbesar. Selanjutnya, kami merancang dan menerapkan solusi yang selaras dengan kebutuhan operasional, prioritas bisnis, dan tujuan pertumbuhan Anda. Sebagai mitra teknologi Anda, komitmen kami lebih dari sekadar menyediakan sebuah sistem—kami berfokus menciptakan peningkatan yang terukur dalam efisiensi, produktivitas, optimalisasi biaya, dan kinerja bisnis jangka panjang.",
      emailLabel: "Email",
      phoneLabel: "Telepon",
      reassurance: "Sebagai partner teknologi anda, kami berkomitmen untuk memastikan sistem kami sesuai dengan kebutuhan Anda, kami fokus pada penciptaan peningkatan yang dapat diukur dalam efisiensi, produktivitas, optimasi biaya, dan kinerja bisnis jangka panjang.",
    },
    footer: {
      tagline:
        "Agensi software Indonesia yang membangun sistem AI untuk operasi industri.",
      rights: "Seluruh hak cipta dilindungi.",
      navLabel: "Halaman",
      contactLabel: "Kontak",
      officesLabel: "Wilayah kerja",
    },
  },

  en: {
    nav: [
      { label: "What we build", href: "#keahlian" },
      { label: "Work", href: "#produk" },
      { label: "Industries", href: "#industri" },
      { label: "How we work", href: "#cara-kerja" },
      { label: "Contact", href: "#kontak" },
    ],
    hero: {
      eyebrow: "AI systems for Indonesian industry · Since 2018",
      headline: "Operations that do not stop.",
      subline:
        "AI agents, custom software and ERP integration for Indonesian industry. Plus the hardware it runs on.",
      mediaDescription:
        "Screen recordings of systems RTECH INDO built, running in production: digital fire-readiness inspection, an HSSE command centre, vendor selection automation, and a fire response simulator.",
      architectureDescription:
        "A diagram of a system we build: an ERP and an HRIS feeding an integration layer, which drives an AI agent and a forecasting model, both reporting to a field tablet. The whole system stands on a server inside the client's own building.",
    },
    rails: {
      capabilities: "What we build",
      work: "Systems running in production",
      industries: "Industries we know",
      prev: "Scroll left",
      next: "Scroll right",
      inProduction: "In production",
      delivered: "Delivered",
    },
    cta: {
      primary: "Book a scoping call",
      secondary: "See what we've built",
      href: pending("Booking URL: Cal.com, Calendly, or a form route"),
    },
    clients: {
      label: "Trusted by",
    },
    process: {
      badge: "How we work",
      heading: "Four stages, and you can stop after any of them.",
      body: "",
      phaseLabel: "Stage",
      of: "of",
      deliverablesLabel: "What you get",
      needsLabel: "What we need",
      gateLabel: "Go / stop",
      phases: phasesEn,
    },
    about: {
      badge: "About us",
      heading: "We are not finished until the system is in use.",
      body: "Since 2018: HSSE digitalisation, ERP integration, command centres, and Agentic AI that already solved our clients' problems.",
      teamLabel: "Who you'll work with",
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
      heading: "Where we have worked.",
      sectors: sectorsEn,
      projectCount: { one: "Project", other: "Projects" },
    },
    products: {
      badge: "Projects we have delivered",
      heading: "Solutions that solved problems for our clients",
      items: [
        {
          id: "hsse-ai",
          slug: "integrated-hsse",
          name: "Integrated HSSE",
          client: "Pertamina",
          sector: "Oil and Gas",
          status: "in-production",
          year: 2024,
          stack: ["Next.js", "Python", "Computer vision", "On-premise"],
          blurb:
            "AI-generated checklists, pipeline visualisation, and an operational command centre. the AI also will suggest the incident prevention and equipment maintenance schedule based on the data from the field and the past incident report",
        },
        {
          id: "hr-agent",
          slug: "hr-recruitment-agent",
          name: "HR Recruitment Agent",
          client: "JAS Airport Services",
          sector: "Aviation",
          status: "in-production",
          year: 2025,
          stack: ["Agentic AI", "ERP", "HRIS"],
          blurb:
            "Agentic AI that help internal hiring team to find the best candidate for the job, faster and more accurate. it's integrated with the company's ERP and HRIS system, and can be accessed through a web interface or a mobile app.",
        },
        {
          id: "optigain",
          slug: "optigain",
          name: "OPTIGAIN",
          client: "Manufacture",
          sector: "Manufacture",
          status: "delivered",
          year: 2024,
          stack: ["Forecasting", "Dashboard", "Python"],
          blurb:
            "Sales and selling volumes data analysis with an executive summary and AI product recommendations and optimization.",
        },
        {
          id: "fire-truck",
          slug: "fire-truck-simulator",
          name: "Fire Truck Simulator",
          client: "Pertamina",
          sector: "Oil and Gas",
          status: "delivered",
          year: 2023,
          stack: ["Simulation", "3D", "Training"],
          blurb:
            "Emergency fire response training, without taking real appliances off the line.",
        },
        {
          id: "FIFO",
          slug: "fifo-vendor-selection",
          name: "FIFO - Vendor Selection Automation",
          client: "JAS Airport Services",
          sector: "Aviation",
          status: "in-production",
          year: 2025,
          stack: ["Agentic AI", "Procurement", "ERP"],
          blurb:
            "Implementing AI solutions for vendor selection and procurement processes, enabling faster and more accurate decision-making.",
        },
        {
          id: "hsse",
          slug: "fire-readiness-system",
          name: "Integrated Fire Readiness System",
          client: "Pertamina",
          sector: "Oil and Gas",
          status: "in-production",
          year: 2023,
          stack: ["Next.js", "Tablet", "Offline-first"],
          blurb:
            "Digital inspection of fire readiness equipment. Desktop and field tablets. and do the daily report also incident report",
        },
      ],
      captureKinds: { film: "Product film", capture: "Screen recording" },
      playLabel: "Play",
      clientLabel: "Client",
    },
    team: {
      members: teamEn,
    },
    contact: {
      badge: "Contact",
      heading: "Start with the process that matters most.",
      body: "Every business has a process that consumes too much time, creates unnecessary costs, or depends heavily on manual work. That’s where we start. We work closely with your team to understand how the process operates, identify what is slowing the business down, and determine where technology can create the greatest business impact. We then design and implement solutions that align with your operational needs, business priorities, and growth objectives. As your technology partner, our commitment goes beyond delivering a system, we focus on creating measurable improvements in efficiency, productivity, cost optimization, and long-term business performance.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      reassurance: "As your technology partner, our commitment goes beyond delivering a system, we focus on creating measurable improvements in efficiency, productivity, cost optimization, and long-term business performance.",
    },
    footer: {
      tagline:
        "An Indonesian software agency building AI systems for industrial operations.",
      rights: "All rights reserved.",
      navLabel: "Pages",
      contactLabel: "Contact",
      officesLabel: "Where we work",
    },
  },
};

/**
 * Titles are deliberately sector-neutral: the agency takes work across
 * industries, and naming energy in the title told both Google and a visitor
 * from any other sector that they were in the wrong place.
 *
 * The narrow terms that actually rank — "digitalisasi HSSE", "command center
 * operasional" — moved into the description rather than being dropped. The
 * title reads broad; the description stays findable.
 *
 * The word budget on the page copy means these carry more weight than they did.
 * Both terms also survive on the page itself: "digitalisasi HSSE" and "command
 * center" are in `about.body` and the Oil and Gas sector discipline, "integrasi
 * ERP" in both.
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
