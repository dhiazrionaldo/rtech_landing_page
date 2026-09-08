import { test } from "node:test";
import assert from "node:assert/strict";

import { parseRgbString } from "./token-color.ts";

test("parses an rgb() string", () => {
  assert.deepEqual(parseRgbString("rgb(255, 128, 0)"), [255, 128, 0]);
});

test("parses rgba() and ignores alpha", () => {
  assert.deepEqual(parseRgbString("rgba(10, 20, 30, 0.5)"), [10, 20, 30]);
});

test("parses the space-separated modern form", () => {
  assert.deepEqual(parseRgbString("rgb(1 2 3 / 40%)"), [1, 2, 3]);
});

test("returns null for anything it cannot parse", () => {
  for (const input of ["", "oklch(0.5 0.1 200)", "not a colour", "#fff"]) {
    assert.equal(parseRgbString(input), null, input);
  }
});
