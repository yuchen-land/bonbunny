"use client";

import { motion } from "framer-motion";
import {
  FaTruck,
  FaStore,
  FaBoxOpen,
  FaClock,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const features = [
  {
    icon: FaTruck,
    title: "專業冷藏配送",
    description: "使用專業冷藏配送箱，確保甜點新鮮送達",
  },
  {
    icon: FaClock,
    title: "多時段選擇",
    description: "上午9-12點、下午2-5點，彈性配送時間",
  },
  {
    icon: FaShieldAlt,
    title: "品質保證",
    description: "損壞包賠，退換貨無負擔",
  },
  {
    icon: FaUsers,
    title: "專業客服",
    description: "貼心服務，即時回應您的需求",
  },
];

export default function ShippingPage() {
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
              運送服務
            </h1>
            <p className="text-lg text-foreground/80">
              我們提供專業的配送服務，讓您能享用最新鮮的甜點。
              無論是冷藏宅配還是門市自取，都能確保商品的最佳品質。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Shipping Methods Section */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary"
            {...fadeIn}
          >
            配送方式
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <FaTruck className="w-8 h-8 text-primary mr-4" />
                <h3 className="text-2xl font-bold">冷藏宅配</h3>
              </div>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  全台灣配送，使用專業冷藏配送箱
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  運費：NT$ 150（滿 NT$ 1,000 免運）
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  配送時間：1-2 個工作天
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  可選擇上午或下午配送時段
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <FaStore className="w-8 h-8 text-primary mr-4" />
                <h3 className="text-2xl font-bold">門市自取</h3>
              </div>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  免運費，可指定取貨時間
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  門市地址：台北市大安區甜點街123號
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  營業時間：週一至週日 10:00-21:00
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  提供現場試吃與專人諮詢服務
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Special Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary"
            {...fadeIn}
          >
            特殊配送服務
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="relative p-8 rounded-2xl bg-background-secondary overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              <div className="relative">
                <FaClock className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-4">急件配送</h3>
                <p className="text-foreground/80">
                  如需當天配送服務，請於上午10點前完成訂購，並來電確認。
                  急件配送費用：NT$ 250（限台北市）。
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative p-8 rounded-2xl bg-background-secondary overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              <div className="relative">
                <FaBoxOpen className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-4">大量訂購</h3>
                <p className="text-foreground/80">
                  如需大量訂購（10件以上），請提前5個工作天聯繫我們，
                  我們將提供專人服務與專屬報價。
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
