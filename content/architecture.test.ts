import { test } from "node:test";
import assert from "node:assert/strict";

import { architecture, ARCH_NODE_IDS } from "./architecture.ts";

test("every node id is unique and known", () => {
  const ids = architecture.nodes.map((n) => n.id);
  assert.deepEqual([...ids].sort(), [...ARCH_NODE_IDS].sort());
  assert.equal(new Set(ids).size, ids.length);
});

test("every edge connects two real nodes", () => {
  const ids = new Set(architecture.nodes.map((n) => n.id));
  for (const edge of architecture.edges) {
    assert.ok(ids.has(edge.from), `edge from unknown node ${edge.from}`);
    assert.ok(ids.has(edge.to), `edge to unknown node ${edge.to}`);
    assert.notEqual(edge.from, edge.to, "no self-edges");
  }
});

test("no node is orphaned", () => {
  const touched = new Set(architecture.edges.flatMap((e) => [e.from, e.to]));
  for (const node of architecture.nodes) {
    // The plinth is deliberately unconnected: it is the ground the whole
    // system stands on, not a step in the flow.
    if (node.id === "onprem") continue;
    assert.ok(touched.has(node.id), `${node.id} has no edges`);
  }
});

test("every node is labelled in both locales", () => {
  for (const node of architecture.nodes) {
    for (const locale of ["en", "id"] as const) {
      assert.ok(
        node.label[locale] && node.label[locale].length > 0,
        `${node.id} missing ${locale} label`,
      );
    }
  }
});

test("data flows downward — every edge descends", () => {
  const y = new Map(architecture.nodes.map((n) => [n.id, n.position[1]]));
  for (const edge of architecture.edges) {
    assert.ok(
      y.get(edge.from)! > y.get(edge.to)!,
      `${edge.from} -> ${edge.to} does not descend; direction is meaning here`,
    );
  }
});

test("the graph is acyclic", () => {
  const out = new Map<string, string[]>();
  for (const e of architecture.edges) {
    out.set(e.from, [...(out.get(e.from) ?? []), e.to]);
  }
  const state = new Map<string, 0 | 1 | 2>();
  function visit(id: string) {
    if (state.get(id) === 1) assert.fail(`cycle through ${id}`);
    if (state.get(id) === 2) return;
    state.set(id, 1);
    for (const next of out.get(id) ?? []) visit(next);
    state.set(id, 2);
  }
  for (const node of architecture.nodes) visit(node.id);
});
