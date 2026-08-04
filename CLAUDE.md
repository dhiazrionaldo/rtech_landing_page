# CLAUDE.md

Standing rules for this repository. These apply to every task in this project unless I explicitly override them in a message.

## What this is

The marketing landing page for `RTECH INDO`, an AI engineering agency building `[Custom App Development / agentic automation / LLM internal tools / ML forecasting]` for `Indonesian business who seek for digital transformation and automation projects`.

Single conversion goal: **` a technical decision-maker books a 30-minute scoping call`**. Every section either moves someone toward that or gets cut.

Primary audience: `[board of directors, ops directors and IT directors / managers at Indonesian manufacturers, 200+ staff`. They are skeptical, have seen AI pilots fail, and worry about where their data goes.

## Stack

| | |
|---|---|
| Framework | Next.js 16, App Router, Turbopack |
| React | 19.2, React Compiler enabled |
| Language | TypeScript, `strict: true` |
| Styling | Tailwind CSS |
| Components | shadcn/ui (latest) |
| 3D | `@react-three/fiber` + `@react-three/drei` |
| Scroll | `gsap` / ScrollTrigger, `lenis` |
| Micro-interactions | `motion` (Framer Motion v12+) |
| Deploy | `[Vercel / self-hosted Docker]` |

Do not add dependencies without asking. Do not swap any of the above.

Next.js 16 moves fast — verify API signatures against the installed version's docs or types rather than assuming. Say so if something I've asked for doesn't match the installed API.

## Commands

```bash
[pnpm] dev          # dev server
[pnpm] build        # production build — must pass before any work is "done"
[pnpm] lint
[pnpm] typecheck
[pnpm] dlx shadcn@latest add <component>
```

## Brand and theme

The theme is **already installed** in `app/globals.css` as OKLCH custom properties, with light and `.dark` variants. Read that file — do not duplicate, re-derive, or "improve" the token values.

**Never hardcode a color in a component.** Every color reference goes through a token: `bg-primary`, `text-muted-foreground`, `var(--chart-3)`. If a design needs a color that isn't in the system, that's a conversation with me, not a new hex value.

### What the palette actually is

- **Neutral spine.** Background, foreground, card, muted, secondary, accent, and border are all pure achromatic greys (chroma 0). The page is a greyscale system.
- **One warm accent.** `--primary` is a burnt orange (hue ~49°, L 0.555 light / 0.473 dark). This is the *only* chromatic color in the core UI. It carries CTAs and nothing else by default.
- **A teal data ramp.** `--chart-1` through `--chart-5` are a teal scale (hue ~181–188°), running light to dark. This is the second expressive color and is reserved for **metrics and data visualization**.
- **Generous radius.** `--radius: 0.875rem` (14px). Soft, not sharp. Use the token consistently; don't mix in ad-hoc radii.

### How to use it

- **`--primary` is scarce.** One primary CTA per viewport. An orange accent sprayed across headings, icons, borders, and links makes the page look like a stock template with a hue shift applied. Restraint is what makes it read as premium.
- **The orange/teal relationship is the palette's real asset.** Warm CTA, cool data. On case study cards, render the quantified metric in the teal ramp and let the orange belong to the action. That contrast does a lot of work for an agency selling measurable outcomes.
- **Differentiation cannot come from color here.** A neutral greyscale base with one accent is exactly the shadcn default shape. What separates this page from stock is **typography, layout density, spacing rhythm, and the signature element** — not the palette. Push hard there.
- **The 3D scene samples from these tokens.** Read CSS custom properties into the materials rather than picking scene colors independently. The canvas must recolor correctly when the theme switches.
- **Video and poster frames are graded to match `--background` per mode**, so embedded media blends instead of sitting in a visible box.

### Known issues in the theme — flag before working around

1. **`--primary` gets darker in dark mode** (L 0.473 vs 0.555 light). Most themes lighten the accent in dark mode. As-is, orange text or thin orange strokes on the dark background will be low-contrast. Solid buttons are fine. If you need `--primary` as a *text* color in dark mode, tell me — don't silently substitute a different value.
2. **`--sidebar-primary` uses a different hue than `--primary`** (58° light / 70° dark vs 46°). Visibly more yellow. Confirm with me whether that's intentional before propagating it into new surfaces.
3. **`--chart-1` (L 0.855) is very light** and will fail contrast on the white light-mode background for thin lines, small text, or legend dots. Use `--chart-3` and darker for anything thin in light mode; keep `--chart-1` for large fills.
4. **Chart colors are identical in both modes.** Verify the ramp is legible on both `oklch(1 0 0)` and `oklch(0.145 0 0)` before shipping any data viz.

Report any contrast failures rather than quietly adjusting a token.

### Still needed from the portfolio deck

- **Typefaces**: `[deck fonts → web font substitutions]`
- **Logo**: `public\logo.svg`
- **Positioning line**: `[the one-sentence description of what we do]`
- **What differentiates us**: `[e.g. we ship to production and hand over the infrastructure]`

The deck's *identity and content* carry over. Its *slide layouts* do not — a deck is paced by a speaker, a landing page is scanned by a stranger in eight seconds.

## Design rules

Restyle shadcn primitives to our tokens. Stock shadcn defaults should not be recognizable in the shipped page.

**Banned — these are the AI-agency template and we are not shipping them:**

- Dark navy/black background with a purple→blue or violet→cyan gradient
- Particle fields of connected nodes and edges standing in for "a neural network"
- Glowing translucent orbs, spheres, or blobs as hero objects
- Wireframe brains, circuit-board motifs, matrix rain, isometric robots
- Glassmorphism cards floating over a blurred gradient
- Headlines in the shape of "Transform your business with AI" / "Unlock the power of AI"
- Cream `#F4F1EA` background + serif display + terracotta accent (the *whole combination* is the cliché — our burnt-orange `--primary` is brand and is fine; a warm-cream page built around it is not)
- Near-black + single acid-green accent
- `01 / 02 / 03` numbered markers on anything that isn't genuinely a sequence

Visual language comes from our clients' material world — `[factory floor / warehouse / logistics / control-room instrumentation / real system architecture]` — not from "AI" as an abstraction.

Before showing me a new section, ask yourself whether it would look identical on any other AI agency's site. If yes, redo it and tell me what you changed.

## Motion and 3D

Hard rules, no exceptions without asking:

- `<Canvas>` is always in a client component, `dynamic()`-imported with `ssr: false`, wrapped in `<Suspense>` with a static poster fallback.
- **The 3D canvas is never the LCP element.** All copy is server-rendered and present in the initial HTML.
- `dpr={[1, 1.5]}`. `frameloop="demand"` unless continuously animating. Pause rendering when off-screen via IntersectionObserver.
- Below `768px`: static poster or CSS-only 3D transforms. No WebGL on mobile by default.
- `prefers-reduced-motion: reduce` collapses all scroll transforms to opacity fades or nothing.
- Every ScrollTrigger and GSAP animation is created inside `gsap.context()` and reverted on unmount. Refresh on resize.
- One orchestrated 3D moment per page. Everything around it stays quiet.

The 3D object encodes something true about our work or our clients' operations. If it degrades into unlabeled dots and lines, it has become the neural-network cliché — reject it and propose something else.

Document every trigger and its scrub values in `MOTION.md` as you add it.

## Video

Video and the 3D canvas compete for the same budget. **The hero gets one heavy element, not both** — decide which and tell me why.

- Video is never the LCP element. The poster image is.
- Autoplay requires `muted` + `playsInline`. Never autoplay with audio.
- `preload="none"`, play via IntersectionObserver, pause when off-screen.
- `prefers-reduced-motion: reduce` → poster only.
- Hero background video budget: **under 2 MB**, ship WebM + MP4 + a mobile variant.
- Anything larger is click-to-play behind a poster.
- Whatever the video communicates must also exist as crawlable text on the page.
- Decorative video is `aria-hidden="true"`. Meaningful video gets `VideoObject` JSON-LD.

For case studies, prefer **real screen recordings of systems actually running** over generated cinematic footage. For this agency, proof beats atmosphere.

See the `video-web-integration` skill for encoding commands and implementation.

## Content model

Case studies live in `content/case-studies.ts` (typed) — never hardcoded in JSX.

```ts
type CaseStudy = {
  slug: string
  client: string
  industry: string
  problem: string
  approach: string
  stack: string[]
  result: string
  metrics: { label: string; value: string }[]
  images: { src: string; alt: string }[]
  year: number
  confidential: boolean   // true → render as "a national FMCG distributor"
}
```

Rules:
- Cards lead with a **quantified outcome**, not a project name.
- Metrics come from the deck. **Never invent or inflate a number.** If a real figure isn't available, say so and leave the field out rather than filling it.
- Never fabricate a client logo or name. Anonymize instead.
- Every card links to a real crawlable `/work/[slug]` page, keyboard-reachable, readable with JS disabled.
- Filter state goes in the URL (`?industry=...`) so filtered views are shareable and indexable.

## SEO

Non-negotiable on every route:

- `metadata` / `generateMetadata` export. `metadataBase`, `alternates.canonical`, full OpenGraph + Twitter.
- `opengraph-image.tsx` via `next/og`, per case study.
- `app/sitemap.ts` and `app/robots.ts` generated from the case study source.
- JSON-LD: `ProfessionalService` (real NAP + `areaServed`), `Organization`, `Person` per team member, `FAQPage`, `BreadcrumbList`, `CreativeWork` per case study.
- One `<h1>` per page. Logical heading order. `<section aria-labelledby>`. Descriptive alt text on every image.
- `next/image` with correct `sizes`; `priority` only on the LCP image. `next/font` with `display: swap`.
- Page shell statically prerendered so crawlers receive complete HTML.
- `[If bilingual]` `hreflang` via `alternates.languages` for ID and EN.

## Performance budget

Measured, not assumed. Report real numbers.

| Metric | Budget |
|---|---|
| Lighthouse SEO | 100 |
| Lighthouse A11y | ≥ 95 |
| Lighthouse Perf (mobile, throttled) | ≥ 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

**If the 3D scene breaks the budget, cut the scene — not the budget.**

## Code conventions

- Server Components by default. `"use client"` only where interactivity genuinely requires it, pushed as far down the tree as possible.
- React Compiler is on — don't hand-write `useMemo` / `useCallback` / `memo` unless profiling shows a specific need.
- Colocate components with their route unless shared; shared ones go in `components/`.
- Named exports. No `any`. No `@ts-ignore` without a comment explaining why.
- No `console.log` in committed code.
- Tailwind utilities in the markup; reach for `@apply` only for genuinely repeated patterns.

## Copy voice

Active voice. Sentence case. Plain verbs. Specific over clever.

Banned words: leverage, empower, revolutionize, seamless, cutting-edge, game-changing, unlock, transform (as a headline verb), robust, holistic.

A button that says "Book a scoping call" leads to something that says "Book a scoping call."

Write for a skeptical ops director, not for a VC.

## Accessibility floor

- Responsive from 320px. Test 320 / 768 / 1024 / 1440 / 1920.
- Visible focus indicators everywhere. Full tab-order pass including the portfolio track.
- Contrast ≥ 4.5:1 for body text.
- No layout shift from fonts, images, or the canvas mounting.

## How I want you to work

Build in stages and **pause for my review after each**:

1. Design plan (palette, type, layout concepts, signature element) — no code
2. Static page, real copy, no motion
3. Scroll animation
4. 3D scene
5. SEO + performance pass

Screenshot your work and critique it before showing me. If something feels templated or you're unsure about a design decision, say so instead of shipping it quietly.

Ask before: adding dependencies, changing the data model, restructuring routes, or working around a performance budget.

## Definition of done

- [ ] `build`, `lint`, `typecheck` all pass
- [ ] Zero console errors, zero hydration mismatches
- [ ] `curl -s <url> | grep "<headline>"` returns the real copy
- [ ] Rich Results Test passes for all schema
- [ ] Mobile PageSpeed within budget above
- [ ] Keyboard-only pass through the full page
- [ ] Renders correctly with `prefers-reduced-motion: reduce`