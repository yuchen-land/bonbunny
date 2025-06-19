import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../../auth/utils";
import { z } from "zod";

// 驗證請求數據的 schema
const settingsSchema = z.object({
  shopName: z.string().min(1, { message: "請輸入商店名稱" }),
  shopDescription: z.string(),
  contactEmail: z.string().email({ message: "請輸入有效的電子郵件地址" }),
  contactPhone: z.string(),
  shippingFee: z.number().min(0),
  freeShippingThreshold: z.number().min(0),
  allowGuestCheckout: z.boolean(),
  requireEmailVerification: z.boolean(),
  orderConfirmationEmail: z.boolean(),
  shippingNotificationEmail: z.boolean(),
});

// 取得系統設定
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

    // 獲取所有設定
    const settings = await db.getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "獲取系統設定失敗" }, { status: 500 });
  }
}

// 更新系統設定
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

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // 更新所有設定
    for (const [key, value] of Object.entries(validatedData)) {
      await db.setSetting(key, value);
    }

    // 獲取更新後的所有設定
    const settings = await db.getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Update settings error:", error);
    return NextResponse.json({ error: "更新系統設定失敗" }, { status: 500 });
  }
}
