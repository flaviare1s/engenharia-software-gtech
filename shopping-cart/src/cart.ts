import { FinalizedCartError } from "./cart-errors.ts";
import type { CartItem } from "./cart-item.ts";
import type { DiscountCoupon } from "./discount-coupon.ts";

const MIN_TOTAL = 0;

export class Cart {
  readonly #items: CartItem[] = [];
  #coupon: DiscountCoupon | undefined;
  #isFinalized = false;

  get isFinalized(): boolean {
    return this.#isFinalized;
  }

  // Returns a copy so callers can't add or remove items without going through addItem()
  getItems(): readonly CartItem[] {
    return [...this.#items];
  }

  addItem(item: CartItem): void {
    this.#ensureNotFinalized();
    this.#items.push(item);
  }

  applyCoupon(coupon: DiscountCoupon): void {
    this.#ensureNotFinalized();
    this.#coupon = coupon;
  }

  finalize(): void {
    this.#isFinalized = true;
  }

  calculateTotal(): number {
    const subtotal = this.#items.reduce(
      (accumulatedTotal, item) => accumulatedTotal + item.calculateSubtotal(),
      0,
    );
    const discountedTotal = this.#coupon ? this.#coupon.apply(subtotal) : subtotal;
    // Enforced here rather than in each coupon, so no DiscountCoupon implementation can break it
    return Math.max(MIN_TOTAL, discountedTotal);
  }

  #ensureNotFinalized(): void {
    if (this.#isFinalized) {
      throw new FinalizedCartError();
    }
  }
}
