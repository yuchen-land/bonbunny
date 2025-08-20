import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../../auth/utils";

export async function GET(request: Request) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const user = await db.getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get all orders
    const allOrders = await db.getOrders();

    // Filter orders for this user
    const userOrders = allOrders.filter(
      order => order.shippingInfo.userId === user.id || 
               order.shippingInfo.email === user.email
    );

    // Sort by creation date (newest first)
    userOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      orders: userOrders,
      total: userOrders.length,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    return NextResponse.json(
      {
        error: "Failed to get user orders",
      },
      { status: 500 }
    );
  }
}
