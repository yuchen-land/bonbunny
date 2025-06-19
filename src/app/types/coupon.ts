export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "fixed" | "percentage"; // 固定金額或百分比折扣
  value: number; // 折扣金額或百分比
  minPurchase: number; // 最低消費金額
  maxDiscount?: number; // 最高折扣金額（針對百分比折扣）
  startDate: string;
  endDate: string;
  usageLimit: number; // 使用次數限制
  usageCount: number; // 已使用次數
  isActive: boolean;
  createdAt: string;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
}
