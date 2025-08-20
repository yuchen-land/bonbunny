import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";

// 驗證轉帳回報資料的 schema
const transferReportSchema = z.object({
  orderId: z.string(),
  transferDate: z.string(),
  transferTime: z.string(),
  transferAmount: z.string(),
  transferAccount: z.string(),
  receiptFile: z.string().optional(), // Base64 編碼的檔案或檔案 URL
});

// 提交轉帳回報
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = transferReportSchema.parse(body);

    // 獲取訂單
    const order = await db.getOrderById(validatedData.orderId);
    if (!order) {
      return NextResponse.json({
        error: "找不到該訂單"
      }, { status: 404 });
    }

    // 更新訂單的付款資訊
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
      }
    };

    // 更新訂單
    const updatedOrder = await db.updateOrder(validatedData.orderId, {
      paymentInfo: updatedPaymentInfo,
    });

    if (!updatedOrder) {
      return NextResponse.json({
        error: "更新訂單失敗"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "轉帳資訊提交成功",
      order: updatedOrder
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "資料驗證失敗",
        details: error.errors
      }, { status: 400 });
    }

    console.error("Transfer report error:", error);
    return NextResponse.json({
      error: "提交轉帳資訊失敗"
    }, { status: 500 });
  }
}

// 獲取轉帳回報資訊
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({
        error: "缺少訂單ID"
      }, { status: 400 });
    }

    const order = await db.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({
        error: "找不到該訂單"
      }, { status: 404 });
    }

    return NextResponse.json({
      orderId,
      transferDetails: order.paymentInfo.transferDetails || null,
    });

  } catch (error) {
    console.error("Get transfer report error:", error);
    return NextResponse.json({
      error: "獲取轉帳資訊失敗"
    }, { status: 500 });
  }
}
