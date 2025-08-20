export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // Support multiple images
  category: ProductCategory;
  subCategory?: string; // Sub-category
  stock: number; // Stock quantity
  status: ProductStatus; // Product status
  specifications?: Record<string, string>; // Product specifications like size, weight etc.
  ingredients?: string[]; // Ingredients list
  allergens?: string[]; // Allergen information
  nutritionalInfo?: Record<string, number>; // Nutritional information
  isRecommended?: boolean; // Whether it's a recommended product
  displayOrder?: number; // Display order
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
  DRAFT = "draft", // Draft
  ACTIVE = "active", // Listed
  INACTIVE = "inactive", // Unlisted
  SOLDOUT = "soldout", // Sold out
  DELETED = "deleted", // Deleted
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingInfo {
  userId?: string; // User ID, empty for non-logged-in users
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
  method: PaymentMethod;
  // 信用卡相關欄位（保留但設為可選）
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  // 銀行轉帳相關欄位
  transferDetails?: {
    transferDate?: string;
    transferTime?: string;
    transferAmount?: number;
    transferAccount?: string; // 轉出帳號後五碼
    receiptUrl?: string; // 收據圖片 URL
    isReported?: boolean; // 是否已回報
    reportedAt?: string; // 回報時間
  };
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

export type PaymentMethod = "bank_transfer";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Password field (only used in backend)
  isAdmin?: boolean; // Admin privileges
  phone?: string;
  address?: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  createdAt: string;
  orders?: Order[];
  favorites?: string[]; // List of favorite product IDs
  isBlocked?: boolean; // Whether account is blocked
  lastLogin?: string; // Last login time
  role: "admin" | "user"; // Added role property
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
