import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../../auth/utils";
import { z } from "zod";

// Schema for validating request data
const orderUpdateSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

// Get all orders
export async function GET(request: Request) {
  try {
    // Verify admin permissions
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const adminUser = await db.getUserById(decoded.userId);

    if (!adminUser?.isAdmin) {
      return NextResponse.json(
        { error: "No admin permissions" },
        { status: 403 }
      );
    }

    // Get all orders
    const orders = await db.getOrders();

    // Add user information
    const ordersWithUserInfo = await Promise.all(
      orders.map(async (order) => {
        const user = order.shippingInfo.userId
          ? await db.getUserById(order.shippingInfo.userId)
          : null;

        return {
          ...order,
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null,
        };
      })
    );

    return NextResponse.json(ordersWithUserInfo);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to get order list" },
      { status: 500 }
    );
  }
}

// Update order status
export async function PUT(request: Request) {
  try {
    // Verify admin permissions
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const adminUser = await db.getUserById(decoded.userId);

    if (!adminUser?.isAdmin) {
      return NextResponse.json(
        { error: "No admin permissions" },
        { status: 403 }
      );
    }

    // Validate request parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = orderUpdateSchema.parse(body);

    // Update order data
    const updatedOrder = await db.updateOrder(orderId, validatedData);
    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send notification email when order status is updated (to be implemented in real application)
    if (validatedData.status === "shipped") {
      // await sendShippingNotification(updatedOrder);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
