export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "fixed" | "percentage"; // Fixed amount or percentage discount
  value: number; // Discount amount or percentage
  minPurchase: number; // Minimum purchase amount
  maxDiscount?: number; // Maximum discount amount (for percentage discounts)
  startDate: string;
  endDate: string;
  usageLimit: number; // Usage limit
  usageCount: number; // Usage count
  isActive: boolean;
  createdAt: string;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
}
