const FULL_PERCENTAGE = 100;
const VIP_DISCOUNT_PERCENTAGE = 10;
const EMPLOYEE_DISCOUNT_PERCENTAGE = 30;

export interface DiscountStrategy {
  apply(total: number): number;
}

export class RegularDiscount implements DiscountStrategy {
  apply(total: number): number {
    return total;
  }
}

// Integer percentages avoid float errors such as 700 * 0.7 = 489.99999999999994
export class VipDiscount implements DiscountStrategy {
  apply(total: number): number {
    return total - (total * VIP_DISCOUNT_PERCENTAGE) / FULL_PERCENTAGE;
  }
}

export class EmployeeDiscount implements DiscountStrategy {
  apply(total: number): number {
    return total - (total * EMPLOYEE_DISCOUNT_PERCENTAGE) / FULL_PERCENTAGE;
  }
}
