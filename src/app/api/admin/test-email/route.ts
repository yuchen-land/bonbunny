import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";
import { sendOrderConfirmationEmail, sendTransferNotificationEmail } from "@/app/lib/email";
import { verifyToken } from "@/app/api/auth/utils";

const testEmailSchema = z.object({
  type: z.enum(["order_confirmation", "transfer_notification"]),
  orderId: z.string(),
});

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const tokenPayload = await verifyToken(token);

    // Get user data to check role
    const user = await db.getUserById(tokenPayload.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { type, orderId } = testEmailSchema.parse(body);

    // Get order
    const order = await db.getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    let result;
    
    if (type === "order_confirmation") {
      result = await sendOrderConfirmationEmail(order);
    } else if (type === "transfer_notification") {
      if (!order.paymentInfo.transferDetails?.isReported) {
        return NextResponse.json(
          {
            error: "Transfer details not reported for this order",
          },
          { status: 400 }
        );
      }
      result = await sendTransferNotificationEmail(order);
    }

    return NextResponse.json({
      success: true,
      message: `${type} email sent successfully`,
      emailResult: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Data validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Test email error:", error);
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
