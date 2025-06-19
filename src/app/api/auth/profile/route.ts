import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/app/api/auth/utils";

// 驗證請求數據的 schema
const updateProfileSchema = z.object({
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
});

export async function PUT(request: Request) {
  try {
    // 驗證 JWT token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未授權的請求" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);

    // 從"資料庫"中查找用戶
    const user = (global as any).users?.get(decoded.email);

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 });
    }

    const body = await request.json();

    // 驗證請求數據
    const validatedData = updateProfileSchema.parse(body);

    // 更新用戶資料
    Object.assign(user, validatedData);
    (global as any).users.set(decoded.email, user);

    // 返回更新後的用戶資料（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "更新資料過程發生錯誤" },
      { status: 500 }
    );
  }
}
