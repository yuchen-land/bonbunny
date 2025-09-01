import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../auth/utils";
import { z } from "zod";
import type { Coupon } from "@/app/types/coupon";

// Schema for validating coupon data
const couponSchema = z.object({
  code: z.string().min(3, { message: "優惠券代碼至少需要 3 個字符" }),
  name: z.string().min(2, { message: "優惠券名稱至少需要 2 個字符" }),
  description: z.string(),
  type: z.enum(["fixed", "percentage"]),
  value: z.number().min(0),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean(),
});

// Apply coupon (public endpoint)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;

    if (!code || typeof orderTotal !== "number") {
      return NextResponse.json(
        {
          error: "缺少優惠券代碼或訂單金額",
        },
        { status: 400 }
      );
    }

    // Get coupon from database
    const coupon = await db.getCouponByCode(code);

    if (!coupon) {
      return NextResponse.json(
        {
          error: "優惠券不存在",
        },
        { status: 404 }
      );
    }

    // Validate coupon
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (!coupon.isActive) {
      return NextResponse.json(
        {
          error: "優惠券已停用",
        },
        { status: 400 }
      );
    }

    if (now < startDate) {
      return NextResponse.json(
        {
          error: "優惠券尚未生效",
        },
        { status: 400 }
      );
    }

    if (now > endDate) {
      return NextResponse.json(
        {
          error: "優惠券已過期",
        },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        {
          error: "優惠券使用次數已達上限",
        },
        { status: 400 }
      );
    }

    if (coupon.minPurchase && orderTotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `最低消費金額為 NT$ ${coupon.minPurchase}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "fixed") {
      discountAmount = coupon.value;
    } else if (coupon.type === "percentage") {
      discountAmount = Math.floor(orderTotal * (coupon.value / 100));
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
      },
      discountAmount,
      finalTotal: orderTotal - discountAmount,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    return NextResponse.json(
      {
        error: "套用優惠券時發生錯誤",
      },
      { status: 500 }
    );
  }
}

// Get available coupons (public endpoint)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      // Admin view - verify authentication
      const authHeader = request.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "未授權的請求" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];
      const decoded = await verifyToken(token);
      const adminUser = await db.getUserById(decoded.userId);

      if (!adminUser?.isAdmin) {
        return NextResponse.json({ error: "無管理員權限" }, { status: 403 });
      }

      // Return all coupons for admin
      const allCoupons = await db.getCoupons();
      return NextResponse.json(allCoupons);
    } else {
      // Public view - only active coupons
      const allCoupons = await db.getCoupons();
      const activeCoupons = allCoupons.filter((coupon) => {
        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        return coupon.isActive && now >= startDate && now <= endDate;
      });
      return NextResponse.json(activeCoupons);
    }
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json(
      {
        error: "獲取優惠券失敗",
      },
      { status: 500 }
    );
  }
}
