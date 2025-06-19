import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/api/auth/utils";
import { z } from "zod";
import { ProductCategory, ProductStatus } from "@/app/types";

// 驗證請求數據的 schema
const productSchema = z.object({
  name: z.string().min(2, { message: "商品名稱至少需要 2 個字符" }),
  description: z.string().min(10, { message: "商品描述至少需要 10 個字符" }),
  price: z.number().min(0, { message: "價格不能小於 0" }),
  images: z.array(z.string()).min(1, { message: "至少需要一張商品圖片" }),
  category: z.nativeEnum(ProductCategory),
  subCategory: z.string().optional(),
  stock: z.number().min(0, { message: "庫存不能小於 0" }),
  status: z.nativeEnum(ProductStatus),
  specifications: z.record(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  nutritionalInfo: z.record(z.number()).optional(),
  isRecommended: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

interface ProductQueryParams {
  category?: ProductCategory;
  status?: ProductStatus;
  isRecommended?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 查詢參數 schema
const querySchema = z.object({
  category: z.nativeEnum(ProductCategory).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  isRecommended: z.string().optional(), // 從 URL 傳來的是字串
  search: z.string().optional(),
  limit: z.string().optional(), // 從 URL 傳來的是字串
  offset: z.string().optional(), // 從 URL 傳來的是字串
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// 轉換查詢參數類型
const processQueryParams = (
  params: z.infer<typeof querySchema>
): ProductQueryParams => {
  const processed: ProductQueryParams = {
    category: params.category,
    status: params.status,
    search: params.search,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  };

  if (params.limit) {
    processed.limit = parseInt(params.limit);
  }
  if (params.offset) {
    processed.offset = parseInt(params.offset);
  }
  if (params.isRecommended) {
    processed.isRecommended = params.isRecommended === "true";
  }

  return processed;
};

// 取得商品列表
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

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // 驗證查詢參數
    const validatedParams = querySchema.parse(queryParams);
    const processedParams = processQueryParams(validatedParams);

    // 獲取商品列表
    const result = await db.getProducts(processedParams);

    return NextResponse.json(result);
  } catch (error) {
    console.error("獲取商品列表失敗:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "無效的查詢參數", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "獲取商品列表失敗" }, { status: 500 });
  }
}

// 創建新商品
export async function POST(request: Request) {
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

    // 驗證請求數據
    const validatedData = productSchema.parse(data);

    // 創建商品
    const newProduct = await db.createProduct(validatedData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("創建商品失敗:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "無效的商品數據", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "創建商品失敗" }, { status: 500 });
  }
}
