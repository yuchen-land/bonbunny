"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCalendar, FaUser, FaTag, FaClock } from "react-icons/fa";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: number;
  tags: string[];
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "手工餅乾的製作秘訣",
    excerpt:
      "分享我們在餅乾製作過程中的獨特技巧和心得，讓每一塊餅乾都充滿愛心。",
    content: "詳細內容...",
    image: "/images/cookie-making.jpg",
    author: "Chef Sarah",
    date: "2024-03-15",
    readTime: 5,
    tags: ["烘焙技巧", "餅乾", "手工"],
    category: "烘焙教學",
  },
  {
    id: "2",
    title: "春季限定蛋糕新品介紹",
    excerpt: "迎接春天的到來，我們推出了一系列以春季水果為主題的精美蛋糕。",
    content: "詳細內容...",
    image: "/images/spring-cake.jpg",
    author: "Chef David",
    date: "2024-03-10",
    readTime: 3,
    tags: ["新品", "蛋糕", "春季"],
    category: "產品資訊",
  },
  {
    id: "3",
    title: "如何保存甜點的最佳方法",
    excerpt: "了解不同甜點的保存方式，讓您在家也能享受最佳的口感和品質。",
    content: "詳細內容...",
    image: "/images/storage-tips.jpg",
    author: "營養師 Amy",
    date: "2024-03-05",
    readTime: 4,
    tags: ["保存", "小貼士", "品質"],
    category: "生活知識",
  },
];

const categories = ["全部", "烘焙教學", "產品資訊", "生活知識", "品牌故事"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    if (selectedCategory === "全部") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(
        blogPosts.filter((post) => post.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              BonBunny 部落格
            </h1>
            <p className="text-lg text-foreground/80">
              分享烘焙知識、產品故事，以及甜點生活的美好時光
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {post.readTime} 分鐘閱讀
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {post.title}
                  </h3>

                  <p className="text-muted mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <FaUser className="w-3 h-3" />
                      {post.author}
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      閱讀更多 →
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        <FaTag className="w-2 h-2 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
