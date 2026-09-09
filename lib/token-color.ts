/**
 * Resolves a CSS custom property to an `[r, g, b]` triple a WebGL material can
 * use.
 *
 * Three.js cannot parse `oklch(...)`, and every colour in this project is an
 * OKLCH custom property. Painting one pixel with whatever `getComputedStyle`
 * reports and reading it back normalises every colour space the browser might
 * hand us — `oklch()`, `color(srgb ...)`, `rgb()` — down to sRGB, without
 * pulling in a colour-space library.
 *
 * `parseRgbString` is separated from the DOM work so it can be tested under
 * `node --test`, which has no `document`.
 */
export function parseRgbString(value: string): [number, number, number] | null {
  const match = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * Browser only. Returns white if the token cannot be resolved.
 *
 * `parseRgbString`'s regex is `rgb()`/`rgba()`-shaped, but `getComputedStyle`
 * does not always hand back that shape. Verified live (Task 10c fix round 1):
 * on a browser wide enough gamut to represent our OKLCH tokens outside sRGB,
 * `getComputedStyle` on the same element returns `lab(84.9 -48.15 -1.33)`
 * for `--chart-1`, not an `rgb()` string at all — `parseRgbString` returns
 * `null` for every token on that browser, and every colour in this file
 * falls through to the canvas round-trip below on every call. That fallback
 * is correct (canvas `fillStyle` accepts any CSS colour, including `lab()`,
 * and `getImageData` always reads back sRGB), so colours still resolve
 * correctly — this was checked and is not the cause of any rendering bug —
 * but the `rgb()` fast path above is effectively dead code on such browsers,
 * and the *only* thing keeping colours correct there is this canvas path.
 * If this function is ever rewritten, keep the canvas fallback: it is not
 * a fallback in practice, it is the primary path.
 */
export function resolveToken(token: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  probe.style.position = "absolute";
  probe.style.opacity = "0";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const direct = parseRgbString(computed);
  if (direct) return direct;

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
