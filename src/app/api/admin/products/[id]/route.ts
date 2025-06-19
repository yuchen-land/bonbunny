import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/api/auth/utils";
import { z } from "zod";
import { ProductStatus } from "@/app/types";

// 取得單個商品
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

    const product = await db.getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: "找不到該商品" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("獲取商品資料失敗:", error);
    return NextResponse.json({ error: "獲取商品資料失敗" }, { status: 500 });
  }
}

// 更新商品
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

    const data = await request.json();
    const updatedProduct = await db.updateProduct(params.id, data);

    if (!updatedProduct) {
      return NextResponse.json({ error: "找不到該商品" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("更新商品失敗:", error);
    return NextResponse.json({ error: "更新商品失敗" }, { status: 500 });
  }
}

// 刪除商品
export async function DELETE(
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

    const success = await db.deleteProduct(params.id);
    if (!success) {
      return NextResponse.json({ error: "找不到該商品" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("刪除商品失敗:", error);
    return NextResponse.json({ error: "刪除商品失敗" }, { status: 500 });
  }
}
