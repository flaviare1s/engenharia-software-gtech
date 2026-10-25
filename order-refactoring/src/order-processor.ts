import { isLargeOrder, type Order } from "./order";
import type { OrderNotifier } from "./order-notifier";
import type { OrderService } from "./order-service";

export class OrderProcessor {
  readonly #orderService: OrderService;
  readonly #notifier: OrderNotifier;

  constructor(orderService: OrderService, notifier: OrderNotifier) {
    this.#orderService = orderService;
    this.#notifier = notifier;
  }

  process(order: Order): number {
    const total = this.#orderService.calculateTotal(order);
    if (isLargeOrder(total)) {
      this.#notifier.notifyLargeOrder();
    }
    return total;
  }
}
