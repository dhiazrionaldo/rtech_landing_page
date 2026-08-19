import type { StaticImageData } from "next/image";

import fireTruckPoster from "@/public/image/capture-fire-truck.webp";
import hssePoster from "@/public/image/IFRS.png";
import ihsePoster from "@/public/image/IHSE - AI.png";
import hrPoster from "@/public/image/IHSE - AI.png";
import optigainPoster from "@/public/image/capture-optigain.webp";
import FIFOPoster from "@/public/image/FIFO.png";
import epsonLogo from "@/public/logos/epson.svg";
import hyundaiLogo from "@/public/logos/hyundai.svg";
import jasLogo from "@/public/logos/jas.png";
import kpiLogo from "@/public/logos/kpi.png";
import petLogo from "@/public/logos/pet.png";
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
    src: "/video/IFRS.mp4",
    poster: hssePoster,
    seconds: 58.5,
    kind: "film",
  },
  "hsse-ai": {
    src: "/video/hsse.mp4",
    poster: ihsePoster,
    seconds: 58.5,
    kind: "film",
  },
  "hr-agent": {
    src: "/video/hsse.mp4",
    poster: hrPoster,
    seconds: 58.5,
    kind: "film",
  },
  optigain: {
    src: "/video/optigain.mp4",
    poster: optigainPoster,
    seconds: 43.1,
    kind: "film",
  },
  FIFO: {
    src: "/video/FIFO.mp4",
    poster: FIFOPoster,
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
    captureKinds: Record<ProductCapture["kind"], string>;
    /** Prefixes the product name to name the play control for screen readers. */
    playLabel: string;
    /** Introduces the client on the banner across the top of a product's frame. */
    clientLabel: string;
  };
  team: {
    badge: string;
    heading: string;
    body: string;
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
      { label: "Tentang kami", href: "#tentang" },
      { label: "Keahlian", href: "#keahlian" },
      { label: "Produk", href: "#produk" },
      { label: "Cara kerja", href: "#cara-kerja" },
      { label: "Tim", href: "#tim" },
      { label: "Hubungi kami", href: "#kontak" },
    ],
    hero: {
      badge: "Software agency Indonesia, sejak 2018",
      // Still carries "digitalisasi" and "operasi", the two terms this page
      // ranks on. It states a constraint the reader lives with instead of
      // describing a service category.
      headline: "Spesialis Digitalisasi dan otomasi untuk operasional.",
      // NOT verbatim from the deck. The deck line scoped the agency to Oil &
      // Gas; that was costing cross-sector enquiries, so it was reworded with
      // the client's explicit approval on 2026-08-10. Oil & Gas is still where
      // the work started, not the limit of it, and the three sectors named are
      // the three actually delivered. No others implied.
      //
      // Cut from 37 words to 20. The three-pain list is now two: "data yang
      // tercecer di banyak tempat" was the weakest and the most abstract of the
      // three, and dropping it also breaks the triad.
      standfirst:
        "Kami membangun teknologi untuk bisnis yang harus terus bergerak, apa pun industrinya. Minyak & gas, penerbangan, manufaktur. Kompleksitasnya beda-beda. Tapi keluhannya sering sama: proses masih manual, data terpisah di banyak sistem, dan orang-orang terbaik Anda menghabiskan hari untuk menyiasati inefisiensi. Padahal setiap keputusan bergantung pada informasi yang tepat, di waktu yang tepat. Kami merancang sistem yang menghubungkan operasional Anda dan merapikan alur kerjanya. Rancangannya mengikuti cara bisnis Anda benar-benar berjalan.",
      mediaDescription:
        "Unit komputasi yang kami sesuaikan dengan kebutuhan klien.",
      panelTitle: "Integrated HSSE System",
      panelBody:
        "Inspeksi digital HSSE, visualisasi jalur pipa, command center. Jalan di server Anda.",
    },
    cta: {
      primary: "Jadwalkan sesi scoping",
      secondary: "Lihat yang sudah kami kerjakan",
      href: pending("URL penjadwalan: Cal.com, Calendly, atau rute formulir"),
    },
    clients: {
      label: "Dipercaya oleh",
    },
    process: {
      badge: "Cara kerja",
      heading: "Fase project kami melalui 4 tahapan ini.",
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
          id: "hsse",
          name: "Integrated Fire Readiness System",
          client: "Pertamina",
          blurb:
            "Inspeksi digital kesiapan peralatan pemadam kebakaran. Desktop dan tablet lapangan.",
        },
        {
          id: "hsse-ai",
          name: "Integrated HSSE",
          client: "Pertamina",
          blurb:
            "Checklist dibuat AI, visualisasi jalur pipa, dan command center operasional.",
        },
        {
          id: "optigain",
          name: "OPTIGAIN",
          client: "Manufaktur",
          blurb:
            "Analisis data sales dengan ringkasan eksekutif dan rekomendasi AI.",
        },
        {
          id: "fire-truck",
          name: "Fire Truck Simulator",
          client: "Pertamina",
          blurb:
            "Simulasi tanggap darurat kebakaran, tanpa menurunkan armada sungguhan.",
        },
      ],
      captureKinds: { film: "Video produk", capture: "Rekaman layar" },
      playLabel: "Putar",
      clientLabel: "Klien",
    },
    team: {
      badge: "Tim",
      // The client asked for "Meet the Team". Kept in English on the English
      // page and translated here: every other heading on the Indonesian page is
      // Indonesian, and one English heading in the middle of them reads as an
      // oversight rather than as a choice. Say the word if you want the English
      // phrase on both.
      heading: "Kenali tim kami.",
      body: "Orang yang datang ke sesi scoping adalah orang yang mengerjakan sistemnya.",
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
      { label: "Team", href: "#tim" },
      { label: "Contact", href: "#kontak" },
    ],
    hero: {
      badge: "An Indonesian software agency, since 2018",
      // "Digitalising and Automating operations, business." was the client's
      // line. The intent — say automation, not just digitalisation — is kept.
      // The trailing ", business" is not: it reads as a list that never
      // finishes, and it left the two locales claiming different things.
      headline: "Digitalising and automating operations that cannot stop.",
      standfirst:
        "We build technology for businesses that need to keep moving, regardless of industry. From oil & gas and aviation to manufacturing and beyond, we’ve seen that every business has its own complexity, but many share the same challenges: manual processes, disconnected data, fragmented systems, and valuable people spending too much time working around inefficiencies. Where every decision depends on having the right information at the right moment. We help businesses turn those challenges into opportunities by designing digital solutions that connect operations, streamline workflows, and make information work harder. Whether you’re running a factory, managing a logistics network, serving customers, or scaling a growing enterprise, we build technology around how your business actually works. We turn those hidden complexities into digital systems that connect the entire operation, so technology doesn’t simply sit on top of the business, but becomes part of how the business moves, adapts, and performs.",
      mediaDescription: "A compute unit built to the client's specification.",
      panelTitle: "Integrated HSSE System",
      panelBody:
        "Digital HSSE inspection, pipeline visualisation, command centre. Running on your own servers.",
    },
    cta: {
      primary: "Book a scoping call",
      secondary: "See what we have built",
      href: pending("Booking URL: Cal.com, Calendly, or a form route"),
    },
    clients: {
      label: "Trusted by",
    },
    process: {
      badge: "How we work",
      heading: "How we work on thos 4 phases",
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
      heading: "We are not finished until the system is actually used.",
      body: "Since 2018: HSSE digitalisation, ERP integration, command centres, and Agentic AI that already solved our clients problems.",
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
          name: "Integrated HSSE",
          client: "Pertamina",
          blurb:
            "AI-generated checklists, pipeline visualisation, and an operational command centre. the AI also will suggest the incident prevention and equipment maintenance schedule based on the data from the field and the past incident report",
        },
        {
          id: "hr-agent",
          name: "HR Recruitment Agent",
          client: "JAS Airport Services",
          blurb:
            "Agentic AI that help internal hiring team to find the best candidate for the job, faster and more accurate. it's integrated with the company's ERP and HRIS system, and can be accessed through a web interface or a mobile app.",
        },
        {
          id: "optigain",
          name: "OPTIGAIN",
          client: "Manufacture",
          blurb:
            "Sales and selling volumes data analysis with an executive summary and AI product recommendations and optimization.",
        },
        {
          id: "fire-truck",
          name: "Fire Truck Simulator",
          client: "Pertamina",
          blurb:
            "Emergency fire response training, without taking real appliances off the line.",
        },
        {
          id: "FIFO",
          name: "FIFO - Vendor Selection Automation",
          client: "JAS Airport Services",
          blurb:
            "Implementing AI solutions for vendor selection and procurement processes, enabling faster and more accurate decision-making.",
        },
        {
          id: "hsse",
          name: "Integrated Fire Readiness System",
          client: "Pertamina",
          blurb:
            "Digital inspection of fire readiness equipment. Desktop and field tablets. and do the daily report also incident report",
        },
      ],
      captureKinds: { film: "Product film", capture: "Screen recording" },
      playLabel: "Play",
      clientLabel: "Client",
    },
    team: {
      badge: "Team",
      heading: "Meet the team.",
      body: "The people who turn up to the scoping call are the people who build the system.",
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
      rights: "All rights reserved.",
      navLabel: "Pages",
      contactLabel: "Contact",
      officesLabel: "Where we work",
    },
  },
};

/**
 * Named clients.
 *
 * The logos we hold are the companies' own published marks, not redrawn:
 * Pertamina's from Wikimedia Commons, JAS Airport Services' from ptjas.co.id,
 * Kilang Pertamina Internasional's from kpi.pertamina.com, Pertamina Energy
 * Terminal's from pertamina-pet.com, and Hyundai's and Epson's from Wikimedia
 * Commons.
 * CLAUDE.md forbids fabricating a client logo, and a hand-traced approximation
 * of someone else's trademark is a fabrication — so these are the real files or
 * nothing.
 *
 * `wordmark` is what the mark actually spells, which is not always the short
 * name: it becomes the alt text and the visible label under the mark.
 *
 * ## Two things outstanding on the four newest entries
 *
 * 1. **Artwork.** All six now have a real file, so nothing renders as a
 *    wordmark. The `logo`-less path in `about.tsx` stays: it is what any future
 *    client gets before their mark arrives.
 * 2. **Clearance.** This list used to be described on the page as "two clients
 *    we are able to name", which implies the rest were not cleared. Naming a
 *    client publicly, and especially showing their mark, is usually something
 *    the client has to agree to; Hyundai and Epson in particular have strict
 *    trademark-use policies. Confirm each is cleared before this goes live.
 */
export type Client = {
  name: string;
  wordmark: string;
  sector: string;
  /**
   * The company's own published mark. Optional.
   *
   * A client with no file renders as a typographic wordmark instead. That is
   * deliberate and it is the only honest option while the artwork is missing:
   * CLAUDE.md forbids fabricating a client logo, and a hand-traced or
   * AI-generated approximation of somebody else's registered trademark is a
   * fabrication with a legal edge on it. Setting the client's name in our own
   * typeface claims nothing about their brand.
   *
   * Drop the real file into `public/logos/`, import it at the top of this file,
   * and set it here. Nothing in `about.tsx` needs to change.
   */
  logo?: StaticImageData;
  /** Rendered height in px, images only. Set per mark so marks match optically
   *  rather than sharing a height, which leaves the taller lockup oversized. */
  height?: number;
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
    // "Energy Terminal", not "Energi" — that is how the company's own mark
    // spells it.
    name: "Pertamina Energy Terminal",
    wordmark: "Pertamina Energy Terminal",
    sector: "Oil and Gas",
    // From the company's own site, pertamina-pet.com. The source file carried
    // an opaque off-white plate and a faint grey swoosh, which showed as a
    // visible rectangle against the white plate these marks sit on. Background
    // dropped to transparent and the canvas cropped to the artwork, so it now
    // centres on the same optical line as the others.
    logo: petLogo,
    height: 40,
  },
  {
    name: "Kilang Pertamina Internasional",
    wordmark: "Kilang Pertamina Internasional",
    sector: "Oil and Gas",
    // The company's own footer mark from kpi.pertamina.com. It is a two-line
    // lockup — the Pertamina arrow with the subsidiary name set under the
    // wordmark — so it needs more height than the single-line marks to keep its
    // second line legible.
    logo: kpiLogo,
    height: 42,
  },
  {
    name: "Hyundai",
    wordmark: "Hyundai",
    // "Hyundai Motor Company logo.svg" from Wikimedia Commons.
    logo: hyundaiLogo,
    height: 18,
    // Guessed from the sectors this agency actually works in. Hyundai runs
    // several Indonesian entities and the right one may be automotive
    // manufacturing, heavy industry, or engineering & construction — confirm
    // before this ships.
    sector: "Manufacture",
  },
  {
    name: "Epson",
    wordmark: "Epson",
    // "Epson logo.svg" from Wikimedia Commons.
    logo: epsonLogo,
    height: 20,
    // Same caveat as Hyundai: most likely PT Indonesia Epson Industry, but the
    // legal entity has not been confirmed.
    sector: "Manufacture",
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
