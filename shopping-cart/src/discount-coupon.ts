export interface DiscountCoupon {
  apply(total: number): number;
}
