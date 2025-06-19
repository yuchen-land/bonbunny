"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaCookie,
  FaBirthdayCake,
  FaBreadSlice,
  FaMugHot,
} from "react-icons/fa";
import ProductCard from "./components/ProductCard";
import { Product, ProductCategory, ProductStatus } from "./types";

// 示例商品數據
const featuredProducts: Product[] = [
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
];

const categories = [
  { name: "蛋糕", icon: FaBirthdayCake, category: ProductCategory.CAKE },
  { name: "餅乾", icon: FaCookie, category: ProductCategory.COOKIE },
  { name: "麵包", icon: FaBreadSlice, category: ProductCategory.BREAD },
  { name: "飲品", icon: FaMugHot, category: ProductCategory.DRINK },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:h-[70vh] bg-gradient-to-r from-primary-light to-secondary">
        <div className="container h-full py-20 lg:py-0">
          <div className="flex h-full flex-col justify-center">
            <div className="max-w-2xl space-y-6 animate-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                享受美味甜點的
                <br className="hidden sm:block" />
                <span className="text-primary">完美時光</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted max-w-prose">
                嚴選食材、匠心製作，為您帶來最幸福的甜蜜滋味
              </p>
              <Link
                href="/product"
                className="inline-block btn-primary text-base"
              >
                立即選購
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/images/pattern.png"
            alt="Background pattern"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-background-secondary">
        <div className="container px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            商品分類
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/product?category=${cat.category}`}
                  className="group p-4 sm:p-6 text-center card hover-scale"
                >
                  <div className="mb-3 sm:mb-4 inline-flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium">
                    {cat.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold">推薦商品</h2>
            <Link href="/product" className="btn-secondary w-full sm:w-auto">
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-background-secondary">
        <div className="container px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            為什麼選擇我們
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="p-4 sm:p-6 text-center card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">嚴選食材</h3>
              <p className="text-sm sm:text-base text-muted">
                使用最優質的食材，確保每一口都充滿幸福滋味
              </p>
            </div>
            <div className="p-4 sm:p-6 text-center card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">新鮮製作</h3>
              <p className="text-sm sm:text-base text-muted">
                堅持每日新鮮製作，讓您品嘗最佳風味
              </p>
            </div>
            <div className="p-4 sm:p-6 text-center card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">精緻包裝</h3>
              <p className="text-sm sm:text-base text-muted">
                精美的包裝設計，讓甜點更添儀式感
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
