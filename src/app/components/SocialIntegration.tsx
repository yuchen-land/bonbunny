"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLine,
  FaWhatsapp,
  FaShare,
  FaHeart,
  FaComment,
  FaEye,
} from "react-icons/fa";

interface SocialPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  views: number;
  date: string;
  platform: "instagram" | "facebook" | "line";
}

const socialPosts: SocialPost[] = [
  {
    id: "1",
    image: "/images/strawberry-cake.jpg",
    caption: "新鮮草莓蛋糕 🍓 每一口都是春天的味道！",
    likes: 245,
    comments: 32,
    views: 1200,
    date: "2024-03-15",
    platform: "instagram",
  },
  {
    id: "2",
    image: "/images/earl-grey-cookies.jpg",
    caption: "手工伯爵茶餅乾新鮮出爐 ☕ 茶香四溢，口感酥脆",
    likes: 189,
    comments: 24,
    views: 890,
    date: "2024-03-14",
    platform: "facebook",
  },
  {
    id: "3",
    image: "/images/croissant.jpg",
    caption: "法式可頌麵包 🥐 每日新鮮烘焙，層次豐富",
    likes: 156,
    comments: 18,
    views: 650,
    date: "2024-03-13",
    platform: "line",
  },
];

export default function SocialIntegration() {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  const shareToSocial = (platform: string, post: SocialPost) => {
    const url = `${window.location.origin}/product/${post.id}`;
    const text = post.caption;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "instagram":
        // Instagram 不支援直接分享，提示用戶手動分享
        alert("請手動複製連結到 Instagram 分享");
        navigator.clipboard.writeText(url);
        break;
      case "line":
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`
        );
        break;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram className="text-pink-500" />;
      case "facebook":
        return <FaFacebook className="text-blue-600" />;
      case "line":
        return <FaLine className="text-green-500" />;
      default:
        return <FaShare />;
    }
  };

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">社群動態</h2>
          <p className="text-muted max-w-2xl mx-auto">
            跟隨我們的社群媒體，獲得最新的產品資訊和限時優惠
          </p>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          className="flex justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="https://www.facebook.com/bonbunny"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <FaFacebook className="w-5 h-5" />
            <span>Facebook</span>
          </a>
          <a
            href="https://www.instagram.com/bonbunny"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <FaInstagram className="w-5 h-5" />
            <span>Instagram</span>
          </a>
          <a
            href="https://line.me/ti/p/@bonbunny"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <FaLine className="w-5 h-5" />
            <span>LINE@</span>
          </a>
        </motion.div>

        {/* Social Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {socialPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative h-64">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  {getPlatformIcon(post.platform)}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-800 mb-4 line-clamp-2">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-red-500" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment className="text-blue-500" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye className="text-gray-500" />
                      {post.views}
                    </span>
                  </div>
                  <span>{post.date}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shareToSocial("facebook", post);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaFacebook className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shareToSocial("line", post);
                    }}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaLine className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shareToSocial("whatsapp", post);
                    }}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Generated Content Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">分享您的美好時光</h3>
          <p className="text-muted mb-8">
            使用 #BonBunny 標籤分享您的甜點照片，有機會被我們官方轉發！
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full">
            <span className="font-medium">#BonBunny</span>
            <FaShare className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
