# Motion

Every animation on the page, what triggers it, and what it costs. CLAUDE.md
requires each ScrollTrigger and its scrub values to be recorded here as it is
added — if you add motion and do not add a row, the next person cannot audit the
page against the performance budget.

## Ground rules this page holds to

- **Nothing above the fold animates.** The `<h1>`, the standfirst, and the hero
  poster are the LCP candidates. No tween touches them.
- **Only `opacity` and `transform`.** Neither participates in layout, so no
  animation here can move the page or contribute to CLS.
- **`prefers-reduced-motion: reduce` loads no animation code at all.**
  `registerScrollTrigger()` in `lib/motion.ts` returns `null` before it imports
  anything, so GSAP is never fetched. The CSS start states are additionally
  wrapped in `@media (prefers-reduced-motion: no-preference)`, so content is
  visible even if that check were ever bypassed.
- **JavaScript off means no motion and no hidden content.** The start states are
  scoped to `.js`, a class the inline `<head>` script adds before first paint.
  Without it none of those rules match, so every section renders visible. The
  server HTML contains zero inline `opacity:0` — verify with
  `curl -s localhost:3000/id | grep -c 'opacity:0'`, which must return 0.
- **Every trigger is created inside `gsap.context()`** and reverted on unmount.
- **GSAP is dynamically imported**, so it lands in a chunk fetched on first
  motion component mount rather than in the initial bundle.
- **One canvas.** The node field and brain field were removed on 2026-09-07:
  CLAUDE.md bans particle fields standing in for a neural network and
  wireframe brains by name. Their budget paid for a labelled three.js
  architecture object (Task 10b/10c) that lived here through 2026-09-08.
  Task 10e (2026-09-09) removed that object entirely — the client chose a
  Spline scene instead of running two WebGL runtimes on one page. On
  2026-09-09 that scene moved out of `Billboard`'s right column and became a
  viewport-fixed page-level layer, on the client's instruction that the object
  hold its position through the whole scroll. See trigger 7 below.
- **The lane exists only where the scene does.** The billboard is the only
  `data-scene-zone` on the page and the only thing that reserves the lane;
  every section below it takes the full measure back. `Rail`'s `sceneZone`
  and the `rail-track-lane` fade are still wired but currently unused — they
  are what a rail would need if the scene were ever extended past the hero.
- **The scene has a reserved lane, not a stacking fight.** Because the layer
  is `position: fixed` it cannot push anything aside, so every container keeps
  clear of it deliberately: `--scene-w/-h/-gap/-lane/-inset` in
  `app/globals.css` are the single source for both the object's own size and
  the space each container gives up (`lg:pr-[var(--scene-lane)]` on the
  sections, header rows and footer; `lg:mr-[var(--scene-inset)]` on the
  full-bleed rail track, which is the scroll viewport and so must shrink
  rather than pad). All five tokens are `0` below `lg` and under reduced
  motion, so no container gives up width where no scene renders.
- **The scene has no frame, and neither does the rail's new edge.** The scene
  box carries no border, radius or `overflow` clip; `scene-feather` masks its
  edges so the object dissolves into the page instead of being cut off, and
  that mask also contains the `Spotlight` glow the clip used to hold in. The
  rail track gets the same treatment at `lg` and up (`rail-track`), because
  the lane makes it stop mid-page where a hard cut reads as a chopped card
  rather than as a bleed. Both are masks, not colours — nothing here paints
  over content with a background-matched gradient, so both survive a theme
  switch untouched.
- **The logo corridor is CSS transforms, not WebGL.** That is what lets it run
  below 768px where the Spline scene is gated off. It stops dead when it
  scrolls out of view rather than animating to nobody. It is decorative and
  `aria-hidden` — no links, no text, no tab stops — so every client is also
  named in real text under the band in `trusted-by.tsx`. The two earlier bands
  over the work and industries rails were removed on 2026-09-09; the clips
  they used are still in `public/video/stream` and are now unreferenced.
- **A fixed layer never pauses off-screen.** A hero object stops rendering
  once it scrolls away; this one is on screen for the entire page, so it is
  continuous WebGL for as long as the tab is open and focused. The `lg`
  (1024px) gate is what contains the cost — phones and reduced-motion users
  never fetch the Spline runtime at all, so the mobile Lighthouse budget is
  untouched. Desktop perf is the number to watch here; re-measure before ship.

## Triggers

| # | Element | Component | start | end | scrub | once | Properties |
|---|---|---|---|---|---|---|---|
| 1 | Mission / vision pull-quotes | `Reveal` in `about.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.10s |
| 2 | Three sector cards | `Reveal` in `expertise.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.09s |
| 3 | Four stage cards | `Reveal` in `process.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.09s |
| 4 | Process rail | `ScrubRail` in `process.tsx` | `top 75%` | `center center` | **0.6** | no | `scaleX 0→1`, origin left |
| ~~5~~ | ~~Contact reassurance cards~~ | removed | — | — | — | — | The three cards are one static line of copy now. See the note in `content/copy.ts` on why three claims about our own candour was a formula. |
| 6 | Stat counters (`3`, `10`) | `CountUp` in `hero.tsx` | `top 92%` | — | no | yes | integer 0→value over 1.1s |
| 7 | Fixed Spline scene | `FixedScene` in `fixed-scene.tsx` | IntersectionObserver on `[data-scene-zone]`, `rootMargin 0 0 -35% 0` | zone leaves view | n/a | no | mounts once at page level, `position: fixed` at `z-40`, at `lg` and up, under `prefers-reduced-motion: no-preference`; visible over the billboard only, then cross-fades out over 500ms as the hero leaves; cursor-interactive while in zone (`pointer-events-auto` on the box, never the wrapper); the scene animates under Spline's own control, not GSAP's |
| 9 | Logo corridor (trusted by) | `LogoStream` in `system-stream.tsx` | n/a — CSS animation, not a ScrollTrigger | n/a | n/a | no | one band, two rails of 7 cards each, `translate3d` + `rotateY` on a 26s linear loop, streaming the client marks; paused off-screen via IntersectionObserver (`rootMargin: 200px`), and frozen mid-flight under `prefers-reduced-motion: reduce` |
| 8 | Rail cards (all three rails) | `Reveal` in `rail.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 16→0`, stagger 0.06s |

Trigger 4 is the only scrubbed **GSAP** animation on the page, and deliberately
so. The rail stands for a run of work with a direction, so tying how much of it
is drawn to how far into the section you are says something true. Scrubbing
anything decorative is how a page starts to feel like it is animating *at* you.

Trigger 6 skips the founding year on purpose. `2018` was never a quantity, and a
year spinning like an odometer on a page whose argument is "we do not inflate
numbers" is the wrong note. The flag lives on the stat data as `countUp` in
`content/copy.ts`.

Trigger 7 is intentionally not a `ScrollTrigger`, a scroll choreography, or
even a scroll listener — it is a hero-only element that mounts once and lets
Spline drive whatever motion the scene itself contains.

### Task 10e (2026-09-09) — Spline scene replaces the three.js architecture object

Client decision: the supplied Spline component replaces the three.js/R3F
architecture diagram rather than run two WebGL runtimes on one page. This
removed, in full, the mechanism the two paragraphs above used to describe in
detail: the fixed page-wide layer mounted in `app/[locale]/page.tsx`, the
`objectX` / `data-object-x` pose contract on `Section` and `Rail` (15
call-site references), the `z-20` / `z-30` elevation split it required on
every text-bearing surface (26 references), `DarkPanel`'s `translucent` prop
(7 references), `lib/token-color.ts` (the OKLCH-to-RGB resolver the R3F
materials needed and nothing else used), and `content/architecture.ts` (the
21-node/edge graph). All deleted, not archived — see git history for the
pre-10e implementation and the Task 10c report for why it looked the way it
did.

**What replaced it.** `FixedScene` (`components/motion/fixed-scene.tsx`) gates
a Spline scene (`components/ui/splite.tsx`, wrapping
`@splinetool/react-spline`) the same way `Architecture` used to gate three.js:
a `useState` flipped by a `matchMedia` check for width (now `1024px`/`lg`,
matching the hero's own two-column breakpoint, not the old `768px`) and
`prefers-reduced-motion`, checked *before* the dynamic import of the Spline
module is requested — so a phone or a reduced-motion user never fetches the
Spline runtime, the same guarantee the outgoing component made for
three.js/R3F. It mounted inside `Billboard`'s right column at first; since
2026-09-09 it is a page-level `position: fixed` layer at `z-40` instead, so
the object holds its viewport position for the entire scroll. There is still
no section choreography to document — unlike the old `Architecture` layer it
reads nothing from scroll position and asks nothing of any other element's
stacking. It is `pointer-events-none` end to end so it cannot intercept a
click meant for the content passing underneath it.

`components/ui/spotlight.tsx` (also supplied, also adapted) sits over the
scene box as a small pointer-tracking glow — see its own file header for
the three fixes made to the supplied version: `motion/react` imports instead
of a second copy of the same library under `framer-motion`, named event
handlers instead of a listener-removal that never actually detached, and the
teal ramp (`--chart-2`) instead of a hardcoded `zinc` gradient. `--primary`
appears nowhere in either new component — orange stays on the CTA.

**Known issue carried forward, not solved by this task:** the wired scene
URL (`https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`) is
Spline's own public sample — an isometric robot. CLAUDE.md bans isometric
robots by name and this exact scene is on thousands of other sites. It is
wired as supplied so the integration is testable end to end; replacing it
with a scene built for RTECH INDO is outstanding before launch. See the Task
10e report for the measured cost (Spline runtime transfer size, scene file
size, Lighthouse before/after).

## Non-scroll motion

| Element | Trigger | Implementation |
|---|---|---|
| Card lift | `:hover` | CSS only, `components/ui/card.tsx`. `-translate-y-1` + border and fill change, 300ms. `motion-reduce:` drops the translate and keeps the colour change. |
| Sector disclosure marker | `<details open>` | CSS only, `group-open:rotate-45`, 200ms. |
| Client logo | — | No motion. Full brand colour at rest. |
| Product capture | click | Poster swaps to `<video>`. No tween. |

## Smooth scroll

Lenis, mounted once in `app/[locale]/layout.tsx` via `SmoothScroll`.

- `duration: 0.9` — above roughly 1s the page reads as fighting the wheel.
- `syncTouch: false` — never on touch. Mobile browsers already have momentum
  scrolling and overriding it is how a page ends up feeling broken on a phone.
- Off entirely under reduced motion. Hijacking the wheel is exactly what that
  setting exists to refuse, and it is a vestibular trigger for some people.
- Wired to ScrollTrigger with three lines: `lenis.on("scroll", ScrollTrigger.update)`,
  `gsap.ticker.add(t => lenis.raf(t * 1000))`, and `gsap.ticker.lagSmoothing(0)`.
  Without the first, Lenis moves the page on its own loop and ScrollTrigger is
  never told the position changed, so every trigger above fires late or not at
  all. The cleanup removes the ticker callback and restores lag smoothing.

## Refresh

`ScrollTrigger` caches element positions at creation. `lib/motion.ts` calls
`ScrollTrigger.refresh()` once `document.fonts.ready` resolves — a late webfont
reflowing headings is the layout change that reliably breaks trigger positions
on this page. ScrollTrigger handles resize on its own.

## Verifying it

The animations are `requestAnimationFrame`-driven, so **they do not advance in a
background or hidden tab** — `document.visibilityState === "hidden"` means zero
frames and every tween sits at its start value. That is browser behaviour, not a
bug, and it makes headless screenshots misleading. To check state without a
visible window, drive the clock by hand in the console:

```js
// after scrolling past a trigger
ScrollTrigger.update();
gsap.ticker.tick();   // advances by the wall clock, so let real time pass
```

To photograph the finished state instead, drop the `.js` class from `<html>` and
clear any inline styles GSAP left mid-flight.
