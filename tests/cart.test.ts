import test from "node:test";
import assert from "node:assert/strict";
import { parseCart, updateQuantity } from "../src/lib/cart.ts";
test("restores valid quantities and merges duplicate items without exceeding the cap", () => {
  assert.deepEqual(
    parseCart(
      JSON.stringify([
        { id: "ring", quantity: 2 },
        { id: "ring", quantity: 15 },
        { id: "hoops", quantity: 2.9 },
      ]),
      ["ring", "hoops"],
    ),
    [
      { id: "ring", quantity: 10 },
      { id: "hoops", quantity: 2 },
    ],
  );
});
test("rejects malformed storage, unknown products, and invalid quantities", () => {
  for (const raw of [null, "{broken", "{}", "null", '[null, 4, "x"]'])
    assert.deepEqual(parseCart(raw, ["ring"]), []);
  assert.deepEqual(
    parseCart(
      JSON.stringify([
        { id: "missing", quantity: 2 },
        { id: "ring", quantity: -4 },
        { id: "ring", quantity: "2" },
        { id: "ring", quantity: 0.2 },
      ]),
      ["ring"],
    ),
    [],
  );
});
test("quantity updates remove items, cap counts, and leave other items untouched", () => {
  const items = [
    { id: "ring", quantity: 2 },
    { id: "hoops", quantity: 1 },
  ];
  assert.deepEqual(updateQuantity(items, "ring", 0), [
    { id: "hoops", quantity: 1 },
  ]);
  assert.deepEqual(updateQuantity(items, "ring", 20), [
    { id: "ring", quantity: 10 },
    { id: "hoops", quantity: 1 },
  ]);
  assert.deepEqual(updateQuantity(items, "ring", NaN), items);
  assert.equal(items[0].quantity, 2);
});

test("fit choices persist as independent cart lines and migrate legacy default lengths", () => {
  const variants = { necklace: ["45 cm", "50 cm"] };
  const cart = parseCart(
    JSON.stringify([
      { id: "necklace", quantity: 1 },
      { id: "necklace", quantity: 2, variant: "45 cm" },
      { id: "necklace", quantity: 2, variant: "50 cm" },
      { id: "necklace", quantity: 4, variant: "invalid option" },
    ]),
    ["necklace"],
    variants,
  );
  assert.deepEqual(cart, [
    { id: "necklace", quantity: 3, variant: "45 cm" },
    { id: "necklace", quantity: 2, variant: "50 cm" },
  ]);
  assert.deepEqual(updateQuantity(cart, "necklace", 0, "50 cm"), [
    { id: "necklace", quantity: 3, variant: "45 cm" },
  ]);
  assert.equal(updateQuantity(cart, "necklace", 7, "50 cm")[0].quantity, 3);
  assert.equal(updateQuantity(cart, "necklace", 7, "50 cm")[1].quantity, 7);
});
