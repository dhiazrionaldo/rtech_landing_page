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

/**
 * Composition point: text plus the assets that go with it.
 *
 * Every string lives in `copy.text.ts`, which imports no images and no `@/`
 * alias. That split is not cosmetic. `node --test` cannot resolve an image
 * extension or a path alias, so a module that imports either cannot be tested
 * at all; and `lib/chat/grounding.ts` builds a prompt string and has no use for
 * six image binaries. Components keep importing `@/content/copy` and see the
 * same API they always did.
 */
export * from "./copy.text";

export type ProductCapture = {
  src: string;
  poster: StaticImageData;
  seconds: number;
  kind: "film" | "capture";
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
