import type { DiscountCoupon } from "./discount-coupon.ts";

const FULL_PERCENTAGE = 100;

export class PercentageCoupon implements DiscountCoupon {
  readonly #percentage: number;

  constructor(percentage: number) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > FULL_PERCENTAGE) {
      throw new RangeError(
        `Percentage must be between 0 and ${FULL_PERCENTAGE}, received ${percentage}`,
      );
    }
    this.#percentage = percentage;
  }

  apply(total: number): number {
    return total - (total * this.#percentage) / FULL_PERCENTAGE;
  }
}
