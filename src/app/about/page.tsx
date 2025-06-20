"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaLeaf, FaHeart, FaStar } from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image
          src="/images/about-banner.jpg"
          alt="BonBunny 烘焙坊"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 px-4 mx-auto text-white">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            {...fadeIn}
          >
            關於 BonBunny
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            用心製作每一份甜點，為您帶來最純粹的幸福感
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              我們的故事
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              BonBunny
              源於一個簡單的夢想：為大家帶來最純粹的甜點幸福感。我們的故事始於2020年，
              由一群熱愛烘焙的夥伴共同創立。從一開始的小型工作室，到現在能夠服務更多喜愛甜點的朋友，
              我們始終堅持著對品質的追求。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            我們的理念
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="p-8 bg-background rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FaLeaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">嚴選食材</h3>
              <p className="text-foreground/80">
                我們堅持使用最優質的食材，從北海道奶油到法國巧克力，
                每一樣原料都經過嚴格把關。
              </p>
            </motion.div>

            <motion.div
              className="p-8 bg-background rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FaHeart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">手工製作</h3>
              <p className="text-foreground/80">
                每一個甜點都由我們的烘焙師傅純手工製作， 注入滿滿的心意與專業。
              </p>
            </motion.div>

            <motion.div
              className="p-8 bg-background rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FaStar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">創新口味</h3>
              <p className="text-foreground/80">
                在保持經典風味的同時，我們也不斷研發新的口味，
                為顧客帶來更多驚喜。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              我們的承諾
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  品質保證
                </h3>
                <p className="text-foreground/80">
                  我們對每一個產品的品質負責，確保送到您手中的都是最完美的甜點。
                </p>
              </div>
              <div className="bg-background-secondary p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  新鮮製作
                </h3>
                <p className="text-foreground/80">
                  所有產品皆為當日新鮮製作，絕不隔夜。
                </p>
              </div>
              <div className="bg-background-secondary p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  安心食材
                </h3>
                <p className="text-foreground/80">
                  使用天然食材，不添加防腐劑和人工香料。
                </p>
              </div>
              <div className="bg-background-secondary p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  專業服務
                </h3>
                <p className="text-foreground/80">
                  提供專業的甜點諮詢服務，為您量身打造完美的甜點體驗。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
