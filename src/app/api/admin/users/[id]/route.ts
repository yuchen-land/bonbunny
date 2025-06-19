import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/api/auth/utils";
import { z } from "zod";

// 驗證請求數據的 schema
const userUpdateSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要 2 個字符" }).optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      district: z.string(),
      postalCode: z.string(),
    })
    .optional(),
  isBlocked: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;
    const user = await db.getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "找不到該用戶" }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("獲取會員資料失敗:", error);
    return NextResponse.json({ error: "獲取會員資料失敗" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;
    const data = await request.json();

    // 驗證更新數據
    const validationResult = userUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "無效的用戶數據", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // 更新用戶
    const updatedUser = await db.updateUser(userId, validationResult.data);
    if (!updatedUser) {
      return NextResponse.json({ error: "找不到該用戶" }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("更新會員資料失敗:", error);
    return NextResponse.json({ error: "更新會員資料失敗" }, { status: 500 });
  }
}
