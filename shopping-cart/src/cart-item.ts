import { InvalidQuantityError } from "./cart-errors.ts";

export class CartItem {
  readonly #name: string;
  readonly #unitPrice: number;
  readonly #quantity: number;

  constructor(name: string, unitPrice: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new InvalidQuantityError(quantity);
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new RangeError(`Unit price must be a non-negative number, received ${unitPrice}`);
    }
    this.#name = name;
    this.#unitPrice = unitPrice;
    this.#quantity = quantity;
  }

  get name(): string {
    return this.#name;
  }

  get unitPrice(): number {
    return this.#unitPrice;
  }

  get quantity(): number {
    return this.#quantity;
  }

  calculateSubtotal(): number {
    return this.#unitPrice * this.#quantity;
  }
}
