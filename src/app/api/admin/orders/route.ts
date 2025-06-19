import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../../auth/utils";
import { z } from "zod";

// 驗證請求數據的 schema
const orderUpdateSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

// 取得所有訂單
export async function GET(request: Request) {
  try {
    // 驗證管理員權限
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未授權的請求" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const adminUser = await db.getUserById(decoded.userId);

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "沒有管理員權限" }, { status: 403 });
    }

    // 獲取所有訂單
    const orders = await db.getOrders();

    // 加入用戶資訊
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
    return NextResponse.json({ error: "獲取訂單列表失敗" }, { status: 500 });
  }
}

// 更新訂單狀態
export async function PUT(request: Request) {
  try {
    // 驗證管理員權限
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未授權的請求" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    const adminUser = await db.getUserById(decoded.userId);

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "沒有管理員權限" }, { status: 403 });
    }

    // 驗證請求參數
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "缺少訂單ID" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = orderUpdateSchema.parse(body);

    // 更新訂單資料
    const updatedOrder = await db.updateOrder(orderId, validatedData);
    if (!updatedOrder) {
      return NextResponse.json({ error: "找不到該訂單" }, { status: 404 });
    }

    // 如果訂單狀態有更新，發送通知郵件（實際應用中實現）
    if (validatedData.status === "shipped") {
      // await sendShippingNotification(updatedOrder);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Update order error:", error);
    return NextResponse.json({ error: "更新訂單狀態失敗" }, { status: 500 });
  }
}
