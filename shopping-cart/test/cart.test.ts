import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Cart } from "../src/cart.ts";
import { FinalizedCartError, InvalidQuantityError } from "../src/cart-errors.ts";
import { CartItem } from "../src/cart-item.ts";
import type { DiscountCoupon } from "../src/discount-coupon.ts";
import { FixedAmountCoupon } from "../src/fixed-amount-coupon.ts";
import { PercentageCoupon } from "../src/percentage-coupon.ts";

function createCartWithTwoBooks(): Cart {
  const cart = new Cart();
  cart.addItem(new CartItem("Livro", 50, 2));
  return cart;
}

describe("exercise test cases", () => {
  it("totals an item with unit price 50 and quantity 2 as 100", () => {
    const cart = createCartWithTwoBooks();

    assert.equal(cart.calculateTotal(), 100);
  });

  it("totals the same cart as 90 after a 10% coupon", () => {
    const cart = createCartWithTwoBooks();

    cart.applyCoupon(new PercentageCoupon(10));

    assert.equal(cart.calculateTotal(), 90);
  });

  it("rejects an item with quantity 0", () => {
    const cart = new Cart();

    assert.throws(() => cart.addItem(new CartItem("Livro", 50, 0)), InvalidQuantityError);
  });

  it("rejects new items after finalize()", () => {
    const cart = createCartWithTwoBooks();

    cart.finalize();

    assert.throws(() => cart.addItem(new CartItem("Caderno", 20, 1)), FinalizedCartError);
  });

  it("totals 0 when a fixed coupon of 150 is applied to a total of 100", () => {
    const cart = createCartWithTwoBooks();

    cart.applyCoupon(new FixedAmountCoupon(150));

    assert.equal(cart.calculateTotal(), 0);
  });
});

describe("CartItem", () => {
  it("rejects negative and non-integer quantities", () => {
    assert.throws(() => new CartItem("Livro", 50, -1), InvalidQuantityError);
    assert.throws(() => new CartItem("Livro", 50, 1.5), InvalidQuantityError);
  });

  it("rejects a negative unit price", () => {
    assert.throws(() => new CartItem("Livro", -50, 1), RangeError);
  });
});

describe("Cart encapsulation", () => {
  it("keeps the internal item list unchanged when the returned list is modified", () => {
    const cart = createCartWithTwoBooks();

    const items = cart.getItems() as CartItem[];
    items.push(new CartItem("Caderno", 20, 1));
    items.length = 0;

    assert.equal(cart.getItems().length, 1);
    assert.equal(cart.calculateTotal(), 100);
  });

  it("rejects a coupon after finalize()", () => {
    const cart = createCartWithTwoBooks();

    cart.finalize();

    assert.throws(() => cart.applyCoupon(new PercentageCoupon(10)), FinalizedCartError);
  });
});

describe("DiscountCoupon contract", () => {
  it("accepts any implementation and still never returns a negative total", () => {
    const cart = createCartWithTwoBooks();
    const doubleDiscountCoupon: DiscountCoupon = { apply: (total) => total - total * 2 };

    cart.applyCoupon(doubleDiscountCoupon);

    assert.equal(cart.calculateTotal(), 0);
  });

  it("rejects a percentage outside 0 to 100", () => {
    assert.throws(() => new PercentageCoupon(101), RangeError);
    assert.throws(() => new PercentageCoupon(-1), RangeError);
  });
});
