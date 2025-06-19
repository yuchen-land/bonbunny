import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// 在實際應用中，這會是一個真實的資料庫
// 目前使用內存存儲作為示例
const users = new Map();

// 驗證請求數據的 schema
const registerSchema = z
  .object({
    email: z.string().email({ message: "請輸入有效的電子郵件地址" }),
    password: z.string().min(6, { message: "密碼至少需要 6 個字符" }),
    confirmPassword: z.string(),
    name: z.string().min(2, { message: "姓名至少需要 2 個字符" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "確認密碼與密碼不符",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 驗證請求數據
    const validatedData = registerSchema.parse(body);

    // 檢查用戶是否已存在
    if (users.has(validatedData.email)) {
      return NextResponse.json(
        { error: "此電子郵件已被註冊" },
        { status: 400 }
      );
    }

    // 加密密碼
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // 創建新用戶
    const newUser = {
      id: crypto.randomUUID(),
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      favorites: [],
      orders: [],
    };

    // 儲存用戶
    users.set(validatedData.email, newUser);

    // 生成 JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // 返回用戶資料（不包含密碼）
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Registration error:", error);
    return NextResponse.json({ error: "註冊過程發生錯誤" }, { status: 500 });
  }
}
