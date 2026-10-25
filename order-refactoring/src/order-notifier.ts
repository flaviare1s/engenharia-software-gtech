export interface OrderNotifier {
  notifyLargeOrder(): void;
  sendOrderEmail(customer: string): void;
}

// The legacy code only logged to the console; a real email or alert channel would implement OrderNotifier
export class ConsoleOrderNotifier implements OrderNotifier {
  notifyLargeOrder(): void {
    console.log("pedido grande");
  }

  sendOrderEmail(customer: string): void {
    console.log(`email para ${customer}`);
  }
}
