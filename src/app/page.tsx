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
  FaStar,
  FaShippingFast,
  FaGift,
  FaHeadset,
  FaShieldAlt,
  FaQuoteLeft,
  FaHandshake,
  FaNewspaper,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Rating,
  Button,
  Paper,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  LocalShipping,
  Schedule,
  Star,
  Favorite,
  ShoppingBag,
} from "@mui/icons-material";
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import { Product, ProductCategory, ProductStatus } from "./types";

// Sample product data
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

// Customer reviews data
const customerReviews = [
  {
    id: 1,
    name: "王小明",
    avatar: "/avatars/user1.jpg",
    rating: 5,
    comment:
      "草莓蛋糕真的太棒了！新鮮的草莓配上綿密的奶油，每一口都是享受。下次還會再來！",
    date: "2024-08-15",
    product: "草莓鮮奶油蛋糕",
  },
  {
    id: 2,
    name: "李美華",
    avatar: "/avatars/user2.jpg",
    rating: 5,
    comment: "伯爵茶餅乾香氣濃郁，口感酥脆，是下午茶的完美選擇。包裝也很精美！",
    date: "2024-08-12",
    product: "伯爵茶餅乾",
  },
  {
    id: 3,
    name: "張志偉",
    avatar: "/avatars/user3.jpg",
    rating: 4,
    comment: "法式可頌層次分明，很有嚼勁。早餐配咖啡超棒的！店員服務也很親切。",
    date: "2024-08-10",
    product: "法式可頌",
  },
];

// Latest news and updates
const newsUpdates = [
  {
    id: 1,
    title: "秋季限定新品上市",
    description: "南瓜戚風蛋糕、肉桂蘋果塔等季節限定商品現已上架",
    excerpt:
      "南瓜戚風蛋糕、肉桂蘋果塔等季節限定商品現已上架，為您帶來濃郁的秋日風味",
    category: "新品發布",
    image: "/images/autumn-special.jpg",
    date: "2024-08-20",
  },
  {
    id: 2,
    title: "中秋節禮盒預購開始",
    description: "精美月餅禮盒，早鳥優惠8折起，數量有限",
    excerpt: "精美月餅禮盒，早鳥優惠8折起，數量有限，為您的中秋佳節增添甜蜜",
    category: "優惠活動",
    image: "/images/mooncake-box.jpg",
    date: "2024-08-18",
  },
  {
    id: 3,
    title: "烘焙課程開課通知",
    description: "專業師傅教學，學會製作經典法式甜點",
    excerpt: "專業師傅教學，學會製作經典法式甜點，從基礎到進階一步步引導",
    category: "課程活動",
    image: "/images/baking-class.jpg",
    date: "2024-08-15",
  },
];

// Services data
const services = [
  {
    title: "快速配送",
    description: "24小時內快速配送到府，保證新鮮品質",
    icon: FaShippingFast,
  },
  {
    title: "精美包裝",
    description: "免費精美包裝服務，適合送禮自用",
    icon: FaGift,
  },
  {
    title: "專業客服",
    description: "專業客服團隊，隨時為您解答疑問",
    icon: FaHeadset,
  },
  {
    title: "品質保證",
    description: "嚴格品質控管，100%滿意保證",
    icon: FaShieldAlt,
  },
];

// Brand partnerships data
const brandPartnerships = [
  {
    id: 1,
    brandName: "台北君悅酒店",
    logo: "/images/partners/grand-hyatt.jpg",
    description: "獨家供應下午茶甜點",
    partnership: "官方合作夥伴",
    year: "2024",
  },
  {
    id: 2,
    brandName: "誠品書店",
    logo: "/images/partners/eslite.jpg",
    description: "書店咖啡廳指定烘焙商",
    partnership: "策略合作",
    year: "2023",
  },
  {
    id: 3,
    brandName: "微風廣場",
    logo: "/images/partners/breeze.jpg",
    description: "美食街優質品牌進駐",
    partnership: "品牌進駐",
    year: "2024",
  },
  {
    id: 4,
    brandName: "遠東百貨",
    logo: "/images/partners/far-eastern.jpg",
    description: "節慶限定商品合作",
    partnership: "活動合作",
    year: "2024",
  },
];

// Media coverage data
const mediaCoverage = [
  {
    id: 1,
    title: "新興烘焙品牌 BonBunny 獲選年度最佳甜點店",
    media: "食尚玩家",
    mediaLogo: "/images/media/supertaste.jpg",
    date: "2024-08-25",
    excerpt: "以創新口味和精緻包裝在競爭激烈的烘焙市場中脫穎而出...",
    link: "#",
  },
  {
    id: 2,
    title: "手工甜點的藝術 - BonBunny 創辦人專訪",
    media: "商業周刊",
    mediaLogo: "/images/media/business-weekly.jpg",
    date: "2024-08-15",
    excerpt: "從家庭烘焙到連鎖品牌，BonBunny 的成功故事...",
    link: "#",
  },
  {
    id: 3,
    title: "台北必吃甜點推薦：BonBunny 草莓蛋糕獲五星評價",
    media: "ETtoday 新聞雲",
    mediaLogo: "/images/media/ettoday.jpg",
    date: "2024-08-10",
    excerpt: "網友一致好評的草莓鮮奶油蛋糕，成為 IG 打卡熱點...",
    link: "#",
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
            <h2 className="text-display-md text-balance text-shadow-soft">
              人氣推薦
            </h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
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
            <h2 className="text-display-md text-balance text-shadow-soft">
              精選系列
            </h2>
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
                    <h3 className="text-lg font-ui font-medium group-hover:text-primary transition-colors">
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
                  <div className="text-2xl font-bold mb-1 text-gradient font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted font-ui">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="section bg-background-secondary/10">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-20" />
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-md text-balance text-shadow-soft mb-4">
              最新消息
            </h2>
            <p className="text-body-lg text-muted">
              掌握第一手資訊，不錯過任何精彩活動
            </p>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsUpdates.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass card group rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-border/20">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary rounded-full text-sm font-medium">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted font-ui">
                      {news.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-body-sm text-muted leading-relaxed">
                    {news.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/10"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="section bg-background-secondary/10">
        <div className="absolute inset-0 bg-[url('/images/curve-pattern.svg')] opacity-20" />
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-md text-balance text-shadow-soft mb-4">
              貼心服務
            </h2>
            <p className="text-body-lg text-muted">
              完善的服務體驗，讓您享受最優質的購物過程
            </p>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="glass card group text-center h-full p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-border/20">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                        <Icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-body-sm text-muted leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="section bg-background">
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-md text-balance text-shadow-soft mb-4">
              顧客回饋
            </h2>
            <p className="text-body-lg text-muted">
              聽聽顧客怎麼說，真實感受分享
            </p>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass card group p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-border/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-primary font-display font-semibold">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-foreground">
                        {review.name}
                      </h4>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <FaQuoteLeft className="absolute -top-2 -left-2 text-primary/20 w-6 h-6" />
                    <p className="text-body-sm text-muted leading-relaxed pl-4">
                      {review.comment}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/10">
                    <div className="flex justify-between items-center text-xs text-muted">
                      <span>{review.product}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partnerships Section */}
      <section className="section bg-background-secondary/10">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-20" />
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-md text-balance text-shadow-soft mb-4">
              品牌合作
            </h2>
            <p className="text-body-lg text-muted">
              與知名企業攜手合作，共創美味體驗
            </p>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandPartnerships.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass card group text-center p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-border/20">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                      <FaHandshake className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {partner.brandName}
                  </h3>
                  <p className="text-body-sm text-muted mb-3 leading-relaxed">
                    {partner.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary rounded-full text-xs font-medium">
                      {partner.partnership}
                    </span>
                    <span className="text-xs text-muted font-ui">
                      {partner.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage Section */}
      <section className="section bg-background">
        <div className="container relative">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-md text-balance text-shadow-soft mb-4">
              新聞報導
            </h2>
            <p className="text-body-lg text-muted">
              媒體關注與報導，見證品牌成長軌跡
            </p>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaCoverage.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass card group rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-border/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FaNewspaper className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-display font-semibold text-foreground">
                        {news.media}
                      </span>
                      <div className="text-xs text-muted font-ui">
                        {news.date}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-body-sm text-muted leading-relaxed mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-border/10">
                    <span className="text-xs text-muted font-ui">新聞報導</span>
                    <a
                      href={news.link}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                    >
                      閱讀更多 <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
