import { Cart } from "./cart.ts";
import { CartItem } from "./cart-item.ts";
import { FixedAmountCoupon } from "./fixed-amount-coupon.ts";
import { PercentageCoupon } from "./percentage-coupon.ts";

const cart = new Cart();
cart.addItem(new CartItem("Livro", 50, 2));
console.log("total:", cart.calculateTotal());              // 100

cart.applyCoupon(new PercentageCoupon(10));
console.log("com 10%:", cart.calculateTotal());            // 90

cart.applyCoupon(new FixedAmountCoupon(150));
console.log("com cupom de 150:", cart.calculateTotal());   // 0

cart.finalize();
cart.addItem(new CartItem("Caderno", 20, 1));              // lança FinalizedCartError
