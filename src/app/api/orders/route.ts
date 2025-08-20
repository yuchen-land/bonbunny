import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";
import type { Order, ShippingInfo, CartItem } from "@/app/types";
import { ProductCategory, ProductStatus } from "@/app/types";

// Schema for validating order data
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

// Create order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Generate unique order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Convert items to CartItem type
    const cartItems: CartItem[] = validatedData.items.map(item => ({
      ...item,
      // Ensure all required fields are present
    }));

    // Create order object
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

    // Save to database
    const savedOrder = await db.createOrder(order);

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: "Order created successfully"
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Data validation failed",
        details: error.errors
      }, { status: 400 });
    }

    console.error("Create order error:", error);
    return NextResponse.json({
      error: "Failed to create order"
    }, { status: 500 });
  }
}

// Get orders (based on orderId query parameter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      // Get single order
      const order = await db.getOrderById(orderId);
      if (!order) {
        return NextResponse.json({
          error: "Order not found"
        }, { status: 404 });
      }
      return NextResponse.json(order);
    } else {
      // Get all orders (used when admin permissions are required)
      const orders = await db.getOrders();
      return NextResponse.json(orders);
    }

  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({
      error: "Failed to get order"
    }, { status: 500 });
  }
}
