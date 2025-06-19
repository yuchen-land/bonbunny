"use client";

import { useEffect, useState } from "react";
import { Product, ProductCategory } from "@/app/types";
import ProductCard from "@/app/components/ProductCard";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.CAKE]: "蛋糕",
  [ProductCategory.COOKIE]: "餅乾",
  [ProductCategory.BREAD]: "麵包",
  [ProductCategory.PASTRY]: "點心",
  [ProductCategory.DRINK]: "飲品",
  [ProductCategory.GIFT_SET]: "禮盒",
  [ProductCategory.OTHER]: "其他",
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${params.category}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.category]);

  const categoryLabel =
    categoryLabels[params.category as ProductCategory] || "未知分類";

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted/20 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">{categoryLabel}</h1>
      {products.length === 0 ? (
        <div className="text-center text-muted py-12">此分類目前沒有商品</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
