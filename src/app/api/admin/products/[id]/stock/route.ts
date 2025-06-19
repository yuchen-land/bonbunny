import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/api/auth/utils";

// 更新商品庫存
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

    const { quantity } = await request.json();
    if (typeof quantity !== "number") {
      return NextResponse.json({ error: "無效的庫存數量" }, { status: 400 });
    }

    const success = await db.updateStock(params.id, quantity);
    if (!success) {
      return NextResponse.json({ error: "更新庫存失敗" }, { status: 400 });
    }

    const product = await db.getProductById(params.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error("更新庫存失敗:", error);
    return NextResponse.json({ error: "更新庫存失敗" }, { status: 500 });
  }
}
