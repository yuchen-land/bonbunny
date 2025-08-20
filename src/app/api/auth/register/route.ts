import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// In a real application, this would be a real database
// Currently using in-memory storage as an example
const users = new Map();

// Schema for validating request data
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

    // Validate request data
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    if (users.has(validatedData.email)) {
      return NextResponse.json(
        { error: "此電子郵件已被註冊" },
        { status: 400 }
      );
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      favorites: [],
      orders: [],
    };

    // Store user
    users.set(validatedData.email, newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data (excluding password)
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
