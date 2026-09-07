import { test } from "node:test";
import assert from "node:assert/strict";

import { copy, seo } from "./copy.text.ts";
import { isPending } from "./pending.ts";

const BANNED = [
  "leverage",
  "empower",
  "revolutionize",
  "seamless",
  "cutting-edge",
  "game-changing",
  "unlock",
  "robust",
  "holistic",
];

/** Every string reachable from a value, however deeply nested. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) strings(v, out);
  else if (value && typeof value === "object") {
    if (isPending(value)) return out; // pending() text is for us, not the page
    for (const v of Object.values(value)) strings(v, out);
  }
  return out;
}

test("no banned word appears in any user-facing string", () => {
  for (const locale of ["en", "id"] as const) {
    for (const s of strings(copy[locale])) {
      for (const word of BANNED) {
        assert.ok(
          !s.toLowerCase().includes(word),
          `banned word "${word}" in ${locale}: ${s.slice(0, 80)}`,
        );
      }
    }
  }
});

test("both locales expose the same keys", () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.id).sort());
});

test("seo metadata exists for both locales", () => {
  for (const locale of ["en", "id"] as const) {
    assert.ok(seo[locale].title.length > 0);
    assert.ok(seo[locale].description.length > 0);
  }
});

test("copy.text.ts imports no image assets", async () => {
  const { readFile } = await import("node:fs/promises");
  const src = await readFile(new URL("./copy.text.ts", import.meta.url), "utf8");
  assert.ok(!/@\/public/.test(src), "copy.text.ts must not import from @/public");
  assert.ok(
    !/\.(png|webp|jpg|jpeg|svg)"/.test(src),
    "copy.text.ts must not import image files",
  );
});
