"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import {
  FaShippingFast,
  FaCreditCard,
  FaBirthdayCake,
  FaLeaf,
} from "react-icons/fa";

const categories = [
  {
    id: "shipping",
    name: "配送相關",
    icon: FaShippingFast,
    faqs: [
      {
        id: 1,
        question: "運送方式有哪些？",
        answer:
          "我們提供宅配服務（全台灣）和店面自取兩種方式。宅配服務會使用低溫配送，確保甜點品質。",
      },
      {
        id: 2,
        question: "可以指定送達時間嗎？",
        answer:
          "是的，您可以在結帳時選擇希望的配送時段（上午9-12點、下午2-5點）。",
      },
      {
        id: 3,
        question: "訂購後多久可以收到商品？",
        answer:
          "一般訂單我們會在1-2個工作天內完成配送。特殊節日期間可能會較為繁忙，建議提前3-5天預訂。",
      },
    ],
  },
  {
    id: "payment",
    name: "付款方式",
    icon: FaCreditCard,
    faqs: [
      {
        id: 4,
        question: "付款方式有哪些？",
        answer:
          "我們接受信用卡、LINE Pay、銀行轉帳和超商付款。所有交易都經過加密保護，確保您的資料安全。",
      },
      {
        id: 5,
        question: "可以更改或取消訂單嗎？",
        answer:
          "訂單送出後2小時內可以更改或取消。超過時間則需要致電客服協助處理。如遇特殊情況，我們會彈性處理。",
      },
    ],
  },
  {
    id: "product",
    name: "商品相關",
    icon: FaBirthdayCake,
    faqs: [
      {
        id: 6,
        question: "商品有保固期限嗎？",
        answer:
          "我們的產品都是新鮮製作，建議在配送當天食用完畢。如需保存，請參考商品標示的保存方式。",
      },
      {
        id: 7,
        question: "商品有提供客製化服務嗎？",
        answer:
          "是的，我們提供蛋糕的客製化服務，包括文字、圖案和尺寸的客製。請提前5天預訂，我們會有專人為您服務。",
      },
    ],
  },
  {
    id: "special",
    name: "特殊需求",
    icon: FaLeaf,
    faqs: [
      {
        id: 8,
        question: "有提供素食選項嗎？",
        answer:
          "是的，我們有提供素食甜點，請在商品分類中查看標示為「素食」的商品。我們也可以依據您的需求客製化。",
      },
      {
        id: 9,
        question: "是否有標示過敏原？",
        answer:
          "我們所有商品都會詳細標示內容物及過敏原資訊。如有特殊需求，也歡迎聯繫我們詢問。",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("shipping");

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
              常見問題
            </h1>
            <p className="text-lg text-foreground/80">
              為了讓您更了解我們的服務，我們整理了常見的問題與解答。
              如有其他問題，歡迎聯繫我們的客服團隊。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Category Tabs */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {categories.map(({ id, name, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`p-4 rounded-xl flex flex-col items-center transition-all ${
                    activeCategory === id
                      ? "bg-primary text-white"
                      : "bg-background-secondary hover:bg-background-secondary/80"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="font-medium">{name}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* FAQ Items */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {categories
                .find((cat) => cat.id === activeCategory)
                ?.faqs.map(({ id, question, answer }) => (
                  <motion.div
                    key={id}
                    className="border border-border rounded-xl overflow-hidden bg-background-secondary hover:bg-background-secondary/80 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      onClick={() => toggleItem(id)}
                    >
                      <span className="font-medium text-lg">{question}</span>
                      <motion.div
                        animate={{ rotate: openItems.includes(id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IoIosArrowDown className="w-6 h-6 text-primary" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openItems.includes(id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0">
                            <p className="text-foreground/80">{answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
