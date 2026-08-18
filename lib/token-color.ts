/**
 * Resolves a CSS custom property to an `[r, g, b]` triple usable in a canvas
 * fill or stroke.
 *
 * Canvas cannot be handed `var(--chart-3)`, and this project's tokens are OKLCH,
 * which `getComputedStyle` may report back as `oklch(...)` or `color(srgb ...)`
 * depending on the browser. Painting one pixel with whatever string comes back
 * and reading it out again normalises every one of those to sRGB without
 * pulling in a colour-space library.
 *
 * Shared by `NodeField` and `BrainField` so the two canvases cannot drift apart
 * on colour, and so CLAUDE.md's "never hardcode a colour in a component" rule
 * holds in the one place it is easiest to break: inside a canvas, where the
 * linter cannot see a hex string.
 */
export function resolveToken(token: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  probe.style.position = "absolute";
  probe.style.opacity = "0";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const scratch = document.createElement("canvas");
  scratch.width = 1;
  scratch.height = 1;
  const ctx = scratch.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [255, 255, 255];
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}
