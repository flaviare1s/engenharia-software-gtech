export class InvalidQuantityError extends RangeError {
  constructor(quantity: number) {
    super(`Quantity must be a positive integer, received ${quantity}`);
    this.name = "InvalidQuantityError";
  }
}

export class FinalizedCartError extends Error {
  constructor() {
    super("Cannot change a cart after it has been finalized");
    this.name = "FinalizedCartError";
  }
}
