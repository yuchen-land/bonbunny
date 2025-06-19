import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// 驗證請求數據的 schema
const loginSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件地址" }),
  password: z.string().min(1, { message: "請輸入密碼" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 驗證請求數據
    const validatedData = loginSchema.parse(body);

    // 從"資料庫"中查找用戶
    const user = (global as any).users?.get(validatedData.email);

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 401 });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // 返回用戶資料（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Login error:", error);
    return NextResponse.json({ error: "登入過程發生錯誤" }, { status: 500 });
  }
}
