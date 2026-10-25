const LARGE_ORDER_THRESHOLD = 500;

export interface OrderItem {
  readonly unitPrice: number;
  readonly quantity: number;
}

export interface Order {
  readonly customer: string;
  readonly items: readonly OrderItem[];
}

export function calculateSubtotal(order: Order): number {
  return order.items.reduce(
    (accumulatedTotal, item) => accumulatedTotal + item.unitPrice * item.quantity,
    0,
  );
}

export function isLargeOrder(total: number): boolean {
  return total > LARGE_ORDER_THRESHOLD;
}
