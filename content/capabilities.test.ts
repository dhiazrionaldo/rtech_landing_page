import { test } from "node:test";
import assert from "node:assert/strict";

import {
  capabilities,
  CAPABILITY_ICON_IDS,
  CAPABILITY_IDS,
} from "./capabilities.ts";

test("both locales define all five capabilities in the same order", () => {
  for (const locale of ["en", "id"] as const) {
    assert.deepEqual(
      capabilities[locale].map((c) => c.id),
      [...CAPABILITY_IDS],
      `${locale} capability ids`,
    );
  }
});

test("every capability has a name, a line, a body and a known icon id", () => {
  for (const locale of ["en", "id"] as const) {
    for (const c of capabilities[locale]) {
      assert.ok(c.name.length > 0, `${locale} ${c.id} name`);
      assert.ok(c.line.length > 0, `${locale} ${c.id} line`);
      assert.ok(c.body.length > 0, `${locale} ${c.id} body`);
      assert.ok(
        CAPABILITY_ICON_IDS.includes(c.icon),
        `${locale} ${c.id} icon must be one of ${CAPABILITY_ICON_IDS.join(", ")}`,
      );
    }
  }
});

test("hardware is last, because it is the backbone and not a headline", () => {
  for (const locale of ["en", "id"] as const) {
    assert.equal(capabilities[locale].at(-1)?.id, "hardware");
  }
});
