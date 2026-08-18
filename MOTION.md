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

## Triggers

| # | Element | Component | start | end | scrub | once | Properties |
|---|---|---|---|---|---|---|---|
| 1 | Mission / vision pull-quotes | `Reveal` in `about.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.10s |
| 2 | Three sector cards | `Reveal` in `expertise.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.09s |
| 3 | Four stage cards | `Reveal` in `process.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.09s |
| 4 | Process rail | `ScrubRail` in `process.tsx` | `top 75%` | `center center` | **0.6** | no | `scaleX 0→1`, origin left |
| ~~5~~ | ~~Contact reassurance cards~~ | removed | — | — | — | — | The three cards are one static line of copy now. See the note in `content/copy.ts` on why three claims about our own candour was a formula. |
| 6 | Stat counters (`3`, `10`) | `CountUp` in `hero.tsx` | `top 92%` | — | no | yes | integer 0→value over 1.1s |

Trigger 4 is the only scrubbed animation on the page, and deliberately so. The
rail stands for a run of work with a direction, so tying how much of it is drawn
to how far into the section you are says something true. Scrubbing anything
decorative is how a page starts to feel like it is animating *at* you.

Trigger 6 skips the founding year on purpose. `2018` was never a quantity, and a
year spinning like an odometer on a page whose argument is "we do not inflate
numbers" is the wrong note. The flag lives on the stat data as `countUp` in
`content/copy.ts`.

## The node field

| Element | Component | Driver | Range | Properties |
|---|---|---|---|---|
| Full-page node field — yaw | `NodeField` in `app/[locale]/layout.tsx` | `window.scrollY / (scrollHeight - innerHeight)` | 0 → 1 over the whole document | camera yaw `0 → 0.7π` |
| Full-page node field — pose | `NodeField`, blended from `[data-field-scene]` | distance of each scene's centre from the viewport's centre | continuous | lateral offset and zoom |

### Scene poses

Each section declares where it wants the field via two props on `Section`
(`fieldX`, `fieldZoom`), which become `data-field-x` / `data-field-zoom`. The
hero carries the attributes directly. A new section joins the choreography by
adding two props — there is no list of section ids inside the canvas component.

| Scene | `fieldX` | `fieldZoom` | Copy reads |
|---|---|---|---|
| Hero | `0` | `1.0` | centred over the field |
| About | `+0.28` | `1.3` | left |
| Expertise | `-0.28` | `1.55` | right |
| Products | `+0.24` | `1.8` | left |
| Process | `-0.24` | `2.0` | right |
| Contact | `0` | `2.3` | centred, closest framing |

`fieldX` is a fraction of viewport width. The alternating sign is what produces
the left/right rhythm in the supplied reference. Mobile takes 25% of the lateral
travel — the full swing on a narrow screen throws most of the field off the edge.

Poses are **blended, not switched**. Every marked element contributes a weight of
`max(0, 1 - distance) ** 2` where distance is measured in viewport heights, so
the nearest scene dominates while the next is already pulling. Hard boundaries
were the first attempt and read as a cut the moment a section edge crossed the
fold.

Not a ScrollTrigger. It reads scroll position directly in its own rAF loop,
which is why it does not appear in the table above — there is no GSAP timeline
to record a scrub value for. It is `position: fixed`, so a single instance
serves every section; the transform is driven by document progress rather than
by any one section's, which is what makes it read as one object you travel past
rather than an effect that restarts.

Cost controls, all in the component:

- `dpr` capped at 1.5.
- 90 nodes on desktop, 34 below 768px, and no autonomous rotation on mobile —
  scroll still moves it, the clock does not.
- rAF stopped by IntersectionObserver off-screen and by `visibilitychange` in a
  background tab.
- `prefers-reduced-motion: reduce` never starts the loop. It paints one frame and
  repaints on scroll only, so the field repositions but never animates by itself.
- Edge testing is O(n²) per frame — 4,005 squared-distance checks at 90 nodes.
  That is the number to watch if the node count is ever raised.

**This is CLAUDE.md's banned motif #2.** It was requested, the conflict was put
to the client, and the ban was overridden on 2026-08-18. The full note is at the
top of `components/motion/node-field.tsx`.

## The hero brain

| Element | Component | Driver | Range | Properties |
|---|---|---|---|---|
| Hero brain — turn | `BrainField` in `hero.tsx` | `window.scrollY / window.innerHeight` | 0 → 1 over the first viewport | yaw `0 → 0.8rad` (~45°), drift `y −8%` |
| Hero brain — sway | `BrainField` | clock | continuous | yaw `±0.1rad` |
| Hero brain — pointer | `BrainField` | `pointermove` on `window` | continuous | parallax ±26px / ±18px, plus local node excitation within 190px |

Geometry is real SVG path data — a cortex silhouette, cerebellum, stem and four
gyri — sampled with `getPointAtLength`. Consecutive samples along a path are
joined to draw the contour; nearby points on *different* paths are cross-linked,
which is what makes it read as a network rather than a line drawing. Edges are
computed once at mount because the shape is rigid, unlike the free field.

Hidden below `lg`. On a narrow screen it lands under the copy, and the full-page
field is already doing that job there.

Three tuning notes, all of them mistakes worth not repeating:

- **Yaw must stay small.** This is a side-view silhouette; past roughly 45° it
  stops reading as a brain, and at 90° it is a vertical line. The idle sway is a
  bounded `sin`, not an accumulating `time * k`, for exactly that reason.
- **Progress is measured off the window, not the canvas rect.** The canvas is
  135% of the card height and offset upward, so its own rect reported ~0.47 at
  the top of the document and the brain arrived already three-quarters turned.
- **Scale is 0.22, not 0.46.** The projection multiplies by `depth * 2.4`
  downstream, so 0.46 spanned ~1200px inside a 760px canvas and only the middle
  of the shape was ever on screen.

**This is CLAUDE.md's banned "wireframe brains".** Requested directly and
overridden on 2026-08-18, in the same conversation as the node-field override.

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
