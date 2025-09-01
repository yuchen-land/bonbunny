import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";
import { ProductCategory, ProductStatus } from "@/app/types";

// Schema for validating search parameters
const searchSchema = z.object({
  q: z.string().optional(), // Search query
  category: z.nativeEnum(ProductCategory).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(["name", "price", "createdAt", "popularity"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate search parameters
    const params = {
      q: searchParams.get("q") || undefined,
      category: (searchParams.get("category") as ProductCategory) || undefined,
      status: (searchParams.get("status") as ProductStatus) || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      inStock: searchParams.get("inStock")
        ? searchParams.get("inStock") === "true"
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "name"
          | "price"
          | "createdAt"
          | "popularity") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    };

    const validatedParams = searchSchema.parse(params);

    // Set default values for required parameters
    const page = validatedParams.page || 1;
    const limit = validatedParams.limit || 12;

    // Get all products from database
    const allProductsResult = await db.getProducts();
    const allProducts = allProductsResult.products;

    // Filter products based on search criteria
    let filteredProducts = allProducts.filter((product) => {
      // Only show active products by default (unless status is specifically requested)
      if (!validatedParams.status && product.status !== ProductStatus.ACTIVE) {
        return false;
      }

      // Status filter
      if (validatedParams.status && product.status !== validatedParams.status) {
        return false;
      }

      // Category filter
      if (
        validatedParams.category &&
        product.category !== validatedParams.category
      ) {
        return false;
      }

      // Price range filter
      if (
        validatedParams.minPrice &&
        product.price < validatedParams.minPrice
      ) {
        return false;
      }
      if (
        validatedParams.maxPrice &&
        product.price > validatedParams.maxPrice
      ) {
        return false;
      }

      // Stock filter
      if (validatedParams.inStock !== undefined) {
        if (validatedParams.inStock && product.stock <= 0) {
          return false;
        }
        if (!validatedParams.inStock && product.stock > 0) {
          return false;
        }
      }

      // Search query filter (search in name, description)
      if (validatedParams.q) {
        const query = validatedParams.q.toLowerCase();
        const searchText =
          `${product.name} ${product.description}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (validatedParams.sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "popularity":
          // For now, use displayOrder as popularity measure
          aValue = a.displayOrder || 999;
          bValue = b.displayOrder || 999;
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (validatedParams.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Get unique categories and price range for filter suggestions
    const availableCategories = Array.from(
      new Set(allProducts.map((p) => p.category))
    );

    const prices = allProducts.map((p) => p.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        availableCategories,
        priceRange,
        appliedFilters: {
          q: validatedParams.q,
          category: validatedParams.category,
          minPrice: validatedParams.minPrice,
          maxPrice: validatedParams.maxPrice,
          inStock: validatedParams.inStock,
          sortBy: validatedParams.sortBy,
          sortOrder: validatedParams.sortOrder,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "搜尋參數驗證失敗",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Product search error:", error);
    return NextResponse.json(
      {
        error: "搜尋產品失敗",
      },
      { status: 500 }
    );
  }
}
