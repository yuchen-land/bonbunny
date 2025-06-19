import { NextRequest, NextResponse } from "next/server";
import { ProductCategory, ProductStatus } from "@/app/types";

// 示例商品數據 - 之後會替換為資料庫查詢
const products = [
  {
    id: "1",
    name: "草莓鮮奶油蛋糕",
    description: "新鮮草莓與輕盈的鮮奶油完美結合",
    price: 580,
    images: ["/images/strawberry-cake.jpg"],
    category: ProductCategory.CAKE,
    stock: 10,
    status: ProductStatus.ACTIVE,
    isRecommended: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "伯爵茶餅乾",
    description: "香醇伯爵茶香的手工餅乾",
    price: 280,
    images: ["/images/earl-grey-cookies.jpg"],
    category: ProductCategory.COOKIE,
    stock: 50,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "法式可頌",
    description: "酥脆層次的經典法式可頌",
    price: 75,
    images: ["/images/croissant.jpg"],
    category: ProductCategory.BREAD,
    stock: 30,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "巧克力慕斯蛋糕",
    description: "濃郁巧克力與細緻慕斯的絕配",
    price: 680,
    images: ["/images/strawberry-cake.jpg"], // 暫用其他圖片
    category: ProductCategory.CAKE,
    stock: 8,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "抹茶拿鐵",
    description: "優質抹茶粉與香濃鮮奶的完美調和",
    price: 140,
    images: ["/images/strawberry-cake.jpg"], // 暫用其他圖片
    category: ProductCategory.DRINK,
    stock: 100,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "節慶禮盒",
    description: "精選甜點組合，最佳送禮選擇",
    price: 1280,
    images: ["/images/strawberry-cake.jpg"], // 暫用其他圖片
    category: ProductCategory.GIFT_SET,
    stock: 15,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 取得查詢參數
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const recommended = searchParams.get("recommended");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // 過濾商品
    let filteredProducts = [...products];

    // 依分類過濾
    if (
      category &&
      Object.values(ProductCategory).includes(category as ProductCategory)
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // 依狀態過濾
    if (
      status &&
      Object.values(ProductStatus).includes(status as ProductStatus)
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === status
      );
    }

    // 依推薦狀態過濾
    if (recommended === "true") {
      filteredProducts = filteredProducts.filter(
        (product) => product.isRecommended
      );
    }

    // 依價格範圍過濾
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= Number(minPrice)
      );
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    // 依關鍵字搜尋（商品名稱和描述）
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // 只回傳上架中的商品
    filteredProducts = filteredProducts.filter(
      (product) => product.status === ProductStatus.ACTIVE
    );

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
