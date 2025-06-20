"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCookie,
  FaBirthdayCake,
  FaBreadSlice,
  FaMugHot,
  FaLeaf,
  FaClock,
  FaHeart,
  FaAward,
} from "react-icons/fa";
import Banner from "./components/Banner";
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
  const stats = [
    { icon: FaHeart, label: "顧客滿意", value: "98%" },
    { icon: FaClock, label: "營業時間", value: "8-21" },
    { icon: FaLeaf, label: "天然食材", value: "100%" },
    { icon: FaAward, label: "專業認證", value: "5+" },
  ];

  return (
    <main className="min-h-screen">
      {/* Banner Section */}
      <Banner />

      {/* Featured Products Section */}
      <section className="section">
        <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] opacity-20" />
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading text-balance">人氣推薦</h2>
            <p className="subheading">
              精心挑選的人氣甜點，讓每一口都充滿幸福感
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-background-secondary/20">
        <div className="absolute inset-0 bg-[url('/images/curve-pattern.svg')] opacity-30" />
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading text-balance">精選系列</h2>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto"></div>
          </motion.div>{" "}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={`/category/${cat.category}`}
                    className="glass group block rounded-lg p-6 text-center border border-border/30 hover:border-primary/30 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass card p-6 text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold mb-1 text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-background-secondary/20">
        <div className="container">
          <div className="glass card max-w-4xl mx-auto p-8 md:p-12">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading text-balance mb-4">訂閱我們</h2>
              <p className="subheading mb-8">
                訂閱電子報，獲得最新優惠和甜點資訊
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="請輸入您的 Email"
                  className="flex-1 rounded-lg border border-border/50 px-4 py-2 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="btn-primary whitespace-nowrap">
                  立即訂閱
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
