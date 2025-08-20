import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";
import type { Order, ShippingInfo, CartItem } from "@/app/types";
import { ProductCategory, ProductStatus } from "@/app/types";

// 驗證訂單資料的 schema
const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    images: z.array(z.string()),
    category: z.nativeEnum(ProductCategory),
    description: z.string(),
    status: z.nativeEnum(ProductStatus),
    stock: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  shippingInfo: z.object({
    userId: z.string().optional(),
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      district: z.string(),
      postalCode: z.string(),
    }),
  }),
  paymentMethod: z.literal("bank_transfer"),
  total: z.number(),
});

// 創建訂單
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // 生成唯一訂單ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // 轉換 items 為 CartItem 類型
    const cartItems: CartItem[] = validatedData.items.map(item => ({
      ...item,
      // 確保所有必要欄位都存在
    }));

    // 創建訂單物件
    const order: Order = {
      id: orderId,
      items: cartItems,
      shippingInfo: validatedData.shippingInfo,
      paymentInfo: {
        method: validatedData.paymentMethod,
      },
      status: "pending",
      total: validatedData.total,
      createdAt: new Date().toISOString(),
    };

    // 保存到資料庫
    const savedOrder = await db.createOrder(order);

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: "訂單創建成功"
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "資料驗證失敗",
        details: error.errors
      }, { status: 400 });
    }

    console.error("Create order error:", error);
    return NextResponse.json({
      error: "創建訂單失敗"
    }, { status: 500 });
  }
}

// 獲取訂單（根據 orderId 查詢參數）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      // 獲取單一訂單
      const order = await db.getOrderById(orderId);
      if (!order) {
        return NextResponse.json({
          error: "找不到該訂單"
        }, { status: 404 });
      }
      return NextResponse.json(order);
    } else {
      // 獲取所有訂單（需要管理員權限的情況下使用）
      const orders = await db.getOrders();
      return NextResponse.json(orders);
    }

  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({
      error: "獲取訂單失敗"
    }, { status: 500 });
  }
}
