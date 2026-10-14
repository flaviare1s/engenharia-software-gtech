import type { DiscountCoupon } from "./discount-coupon.ts";

export class FixedAmountCoupon implements DiscountCoupon {
  readonly #amount: number;

  constructor(amount: number) {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError(`Amount must be a non-negative number, received ${amount}`);
    }
    this.#amount = amount;
  }

  apply(total: number): number {
    return total - this.#amount;
  }
}
