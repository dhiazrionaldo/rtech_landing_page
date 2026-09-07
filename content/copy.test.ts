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

test("every product has rail-card metadata and a unique slug", () => {
  const seen = new Set<string>();
  for (const locale of ["en", "id"] as const) {
    for (const p of copy[locale].products.items) {
      assert.match(p.slug, /^[a-z0-9-]+$/, `${p.id} slug shape`);
      assert.ok(p.sector.length > 0, `${p.id} sector`);
      assert.ok(p.year >= 2018 && p.year <= 2026, `${p.id} year`);
      assert.ok(p.stack.length > 0, `${p.id} stack`);
    }
  }
  for (const p of copy.en.products.items) {
    assert.ok(!seen.has(p.slug), `duplicate slug ${p.slug}`);
    seen.add(p.slug);
  }
});

test("slugs, years and status match across locales", () => {
  const byId = (loc: "en" | "id") =>
    new Map(copy[loc].products.items.map((p) => [p.id, p]));
  const en = byId("en");
  const id = byId("id");
  assert.deepEqual([...en.keys()].sort(), [...id.keys()].sort());
  for (const [key, a] of en) {
    const b = id.get(key)!;
    assert.equal(a.slug, b.slug, `${key} slug`);
    assert.equal(a.year, b.year, `${key} year`);
    assert.equal(a.status, b.status, `${key} status`);
  }
});

test("no product asserts a metric the client has not supplied", () => {
  for (const locale of ["en", "id"] as const) {
    for (const p of copy[locale].products.items) {
      for (const m of p.metrics ?? []) {
        assert.ok(
          typeof m.value === "string" || isPending(m.value),
          `${p.id} metric ${m.label} must be a real string or pending()`,
        );
      }
    }
  }
});
