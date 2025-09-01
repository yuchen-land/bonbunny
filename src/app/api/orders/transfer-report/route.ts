import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";
import {
  sendTransferNotificationEmail,
  sendAdminNotificationEmail,
} from "@/app/lib/email";

// Schema for validating transfer report data
const transferReportSchema = z.object({
  orderId: z.string(),
  transferDate: z.string(),
  transferTime: z.string(),
  transferAmount: z.string(),
  transferAccount: z.string(),
  receiptFile: z.string().optional(), // Base64 encoded file or file URL
});

// Submit transfer report
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = transferReportSchema.parse(body);

    // Get order
    const order = await db.getOrderById(validatedData.orderId);
    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    // Update order payment information
    const updatedPaymentInfo = {
      ...order.paymentInfo,
      transferDetails: {
        transferDate: validatedData.transferDate,
        transferTime: validatedData.transferTime,
        transferAmount: parseInt(validatedData.transferAmount),
        transferAccount: validatedData.transferAccount,
        receiptUrl: validatedData.receiptFile,
        isReported: true,
        reportedAt: new Date().toISOString(),
      },
    };

    // Update order
    const updatedOrder = await db.updateOrder(validatedData.orderId, {
      paymentInfo: updatedPaymentInfo,
    });

    if (!updatedOrder) {
      return NextResponse.json(
        {
          error: "Failed to update order",
        },
        { status: 500 }
      );
    }

    // Send transfer notification email to customer
    try {
      await sendTransferNotificationEmail(updatedOrder);
      console.log(
        `Transfer notification email sent for order: ${updatedOrder.id}`
      );
    } catch (emailError) {
      console.error(
        `Failed to send transfer notification email for order: ${updatedOrder.id}`,
        emailError
      );
      // Don't fail the transfer report if email fails
    }

    // Send admin notification about transfer report
    try {
      await sendAdminNotificationEmail(updatedOrder, "transfer_reported");
      console.log(
        `Admin transfer notification email sent for order: ${updatedOrder.id}`
      );
    } catch (emailError) {
      console.error(
        `Failed to send admin transfer notification email for order: ${updatedOrder.id}`,
        emailError
      );
      // Don't fail the transfer report if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Transfer information submitted successfully",
      order: updatedOrder,
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

    console.error("Transfer report error:", error);
    return NextResponse.json(
      {
        error: "Failed to submit transfer information",
      },
      { status: 500 }
    );
  }
}

// Get transfer report information
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Missing order ID",
        },
        { status: 400 }
      );
    }

    const order = await db.getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId,
      transferDetails: order.paymentInfo.transferDetails || null,
    });
  } catch (error) {
    console.error("Get transfer report error:", error);
    return NextResponse.json(
      {
        error: "Failed to get transfer information",
      },
      { status: 500 }
    );
  }
}
