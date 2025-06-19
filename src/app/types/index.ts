export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // 支援多張圖片
  category: ProductCategory;
  subCategory?: string; // 子分類
  stock: number; // 庫存數量
  status: ProductStatus; // 商品狀態
  specifications?: Record<string, string>; // 商品規格，如尺寸、重量等
  ingredients?: string[]; // 食材列表
  allergens?: string[]; // 過敏原資訊
  nutritionalInfo?: Record<string, number>; // 營養成分
  isRecommended?: boolean; // 是否為推薦商品
  displayOrder?: number; // 顯示順序
  createdAt: string;
  updatedAt: string;
}

export enum ProductCategory {
  CAKE = "cake",
  COOKIE = "cookie",
  BREAD = "bread",
  PASTRY = "pastry",
  DRINK = "drink",
  GIFT_SET = "gift_set",
  OTHER = "other",
}

export enum ProductStatus {
  DRAFT = "draft", // 草稿
  ACTIVE = "active", // 上架中
  INACTIVE = "inactive", // 下架
  SOLDOUT = "soldout", // 售罄
  DELETED = "deleted", // 已刪除
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingInfo {
  userId?: string; // 用戶ID，未登入用戶為空
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: Partial<PaymentInfo>;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
}

export type PaymentMethod = "credit_card" | "line_pay" | "cash_on_delivery";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // 密碼欄位（僅在後端使用）
  isAdmin?: boolean; // 管理員權限
  phone?: string;
  address?: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  createdAt: string;
  orders?: Order[];
  favorites?: string[]; // 收藏商品的ID列表
  isBlocked?: boolean; // 帳號是否被封鎖
  lastLogin?: string; // 最後登入時間
  role: "admin" | "user"; // 新增 role 屬性
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}
