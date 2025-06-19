import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../../auth/utils";
import { z } from "zod";

// 驗證請求數據的 schema
const couponSchema = z.object({
  code: z.string().min(3, { message: "優惠碼至少需要 3 個字符" }),
  name: z.string().min(2, { message: "名稱至少需要 2 個字符" }),
  description: z.string(),
  type: z.enum(["fixed", "percentage"]),
  value: z.number().min(0),
  minPurchase: z.number().min(0),
  maxDiscount: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.number().min(1),
  isActive: z.boolean(),
});

// 取得所有優惠券
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

    // 獲取所有優惠券
    const coupons = await db.getCoupons();
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json({ error: "獲取優惠券列表失敗" }, { status: 500 });
  }
}

// 創建新優惠券
export async function POST(request: Request) {
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
    const validatedData = couponSchema.parse(body);

    // 檢查優惠碼是否已存在
    const existingCoupon = await db.getCouponByCode(validatedData.code);
    if (existingCoupon) {
      return NextResponse.json({ error: "優惠碼已存在" }, { status: 400 });
    }

    // 創建優惠券
    const newCoupon = await db.createCoupon({
      id: crypto.randomUUID(),
      ...validatedData,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newCoupon);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Create coupon error:", error);
    return NextResponse.json({ error: "創建優惠券失敗" }, { status: 500 });
  }
}

// 更新優惠券
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
    const couponId = searchParams.get("couponId");
    if (!couponId) {
      return NextResponse.json({ error: "缺少優惠券ID" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = couponSchema.parse(body);

    // 檢查優惠碼是否與其他優惠券重複
    const existingCoupon = await db.getCouponByCode(validatedData.code);
    if (existingCoupon && existingCoupon.id !== couponId) {
      return NextResponse.json({ error: "優惠碼已存在" }, { status: 400 });
    }

    // 更新優惠券
    const updatedCoupon = await db.updateCoupon(couponId, validatedData);
    if (!updatedCoupon) {
      return NextResponse.json({ error: "找不到該優惠券" }, { status: 404 });
    }

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Update coupon error:", error);
    return NextResponse.json({ error: "更新優惠券失敗" }, { status: 500 });
  }
}

// 刪除優惠券
export async function DELETE(request: Request) {
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
    const couponId = searchParams.get("couponId");
    if (!couponId) {
      return NextResponse.json({ error: "缺少優惠券ID" }, { status: 400 });
    }

    // 刪除優惠券
    const success = await db.deleteCoupon(couponId);
    if (!success) {
      return NextResponse.json({ error: "找不到該優惠券" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return NextResponse.json({ error: "刪除優惠券失敗" }, { status: 500 });
  }
}
