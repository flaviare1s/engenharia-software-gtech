import { afterEach, describe, expect, it, vi } from "vitest";

import { EmployeeDiscount, RegularDiscount, VipDiscount } from "../src/discount-strategies";
import type { Order } from "../src/order";
import { ConsoleOrderNotifier, type OrderNotifier } from "../src/order-notifier";
import { OrderProcessor } from "../src/order-processor";
import { OrderService } from "../src/order-service";

function createOrder(unitPrice: number, quantity: number): Order {
  return { customer: "ana@example.com", items: [{ unitPrice, quantity }] };
}

function createFakeNotifier() {
  return { notifyLargeOrder: vi.fn(), sendOrderEmail: vi.fn() } satisfies OrderNotifier;
}

describe("exercise test cases", () => {
  it("calculates a regular order correctly (100 * 2 = 200)", () => {
    const service = new OrderService(new RegularDiscount());

    expect(service.calculateTotal(createOrder(100, 2))).toBe(200);
  });

  it("calculates a VIP order with a 10% discount (180)", () => {
    const service = new OrderService(new VipDiscount());

    expect(service.calculateTotal(createOrder(100, 2))).toBe(180);
  });

  it("calculates an employee order with a 30% discount (140)", () => {
    const service = new OrderService(new EmployeeDiscount());

    expect(service.calculateTotal(createOrder(100, 2))).toBe(140);
  });
});

describe("OrderService", () => {
  it("sums every item by unit price and quantity", () => {
    const service = new OrderService(new RegularDiscount());
    const order: Order = {
      customer: "ana@example.com",
      items: [
        { unitPrice: 100, quantity: 2 },
        { unitPrice: 25, quantity: 4 },
      ],
    };

    expect(service.calculateTotal(order)).toBe(300);
  });
});

describe("OrderProcessor", () => {
  it("notifies a large order when the discounted total is above 500", () => {
    const notifier = createFakeNotifier();
    const processor = new OrderProcessor(new OrderService(new VipDiscount()), notifier);

    expect(processor.process(createOrder(300, 2))).toBe(540);
    expect(notifier.notifyLargeOrder).toHaveBeenCalledOnce();
  });

  it("checks the large order rule after the discount, like the legacy code", () => {
    const notifier = createFakeNotifier();
    const processor = new OrderProcessor(new OrderService(new EmployeeDiscount()), notifier);

    expect(processor.process(createOrder(350, 2))).toBe(490);
    expect(notifier.notifyLargeOrder).not.toHaveBeenCalled();
  });

  it("does not notify a total of exactly 500", () => {
    const notifier = createFakeNotifier();
    const processor = new OrderProcessor(new OrderService(new RegularDiscount()), notifier);

    processor.process(createOrder(250, 2));

    expect(notifier.notifyLargeOrder).not.toHaveBeenCalled();
  });

  it("never sends the email by itself, so callers no longer need a flag", () => {
    const notifier = createFakeNotifier();
    const processor = new OrderProcessor(new OrderService(new RegularDiscount()), notifier);

    processor.process(createOrder(300, 2));

    expect(notifier.sendOrderEmail).not.toHaveBeenCalled();
  });
});

describe("ConsoleOrderNotifier", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prints the same messages as the legacy code", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const notifier = new ConsoleOrderNotifier();

    notifier.notifyLargeOrder();
    notifier.sendOrderEmail("ana@example.com");

    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "pedido grande");
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "email para ana@example.com");
  });
});
