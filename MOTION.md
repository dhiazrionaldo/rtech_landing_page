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
| 1 | Mission / vision cards | `Reveal` in `about.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.10s |
| 2 | Three sector cards | `Reveal` in `expertise.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.09s |
| 3 | Four stage cards | `Reveal` in `process.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 20→0`, stagger 0.09s |
| 4 | Process rail | `ScrubRail` in `process.tsx` | `top 75%` | `center center` | **0.6** | no | `scaleX 0→1`, origin left |
| 5 | Contact reassurance cards | `Reveal` in `contact.tsx` | `top 86%` | — | no | yes | `opacity 0→1`, `y 14→0`, stagger 0.08s |
| 6 | Stat counters (`3`, `10`) | `CountUp` in `hero.tsx` | `top 92%` | — | no | yes | integer 0→value over 1.1s |

Trigger 4 is the only scrubbed animation on the page, and deliberately so. The
rail stands for a run of work with a direction, so tying how much of it is drawn
to how far into the section you are says something true. Scrubbing anything
decorative is how a page starts to feel like it is animating *at* you.

Trigger 6 skips the founding year on purpose. `2018` was never a quantity, and a
year spinning like an odometer on a page whose argument is "we do not inflate
numbers" is the wrong note. The flag lives on the stat data as `countUp` in
`content/copy.ts`.

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
