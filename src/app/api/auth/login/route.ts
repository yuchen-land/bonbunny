import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Schema for validating request data
const loginSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件地址" }),
  password: z.string().min(1, { message: "請輸入密碼" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = loginSchema.parse(body);

    // Find user in "database"
    const user = (global as any).users?.get(validatedData.email);

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data (excluding password)
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
