import type { DiscountStrategy } from "./discount-strategies";
import { calculateSubtotal, type Order } from "./order";

export class OrderService {
  readonly #discountStrategy: DiscountStrategy;

  constructor(discountStrategy: DiscountStrategy) {
    this.#discountStrategy = discountStrategy;
  }

  calculateTotal(order: Order): number {
    return this.#discountStrategy.apply(calculateSubtotal(order));
  }
}
