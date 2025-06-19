import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "../../auth/utils";

// 取得所有會員
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

    // 獲取所有會員
    const users = await db.getUsers();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json(usersWithoutPassword);
  } catch (error) {
    console.error("獲取會員列表失敗:", error);
    return NextResponse.json({ error: "獲取會員列表失敗" }, { status: 500 });
  }
}
