"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  {
    id: 1,
    image: "/images/strawberry-cake.jpg",
    title: "精選手工甜點",
    description: "每一口都是幸福的滋味",
    link: "/category/cake",
  },
  {
    id: 2,
    image: "/images/earl-grey-cookies.jpg",
    title: "人氣伯爵茶餅乾",
    description: "香醇茶香，口口酥脆",
    link: "/category/cookie",
  },
  {
    id: 3,
    image: "/images/croissant.jpg",
    title: "法式經典可頌",
    description: "層層酥脆，純手工製作",
    link: "/category/bread",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function Banner() {
  const [[currentSlide, direction], setCurrentSlide] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(([prev, _]) => [(prev + 1) % banners.length, 1]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = (newDirection: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(([prev, _]) => [
      (prev + newDirection + banners.length) % banners.length,
      newDirection,
    ]);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image
              src={banners[currentSlide].image}
              alt={banners[currentSlide].title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="container absolute inset-0 flex items-center">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="heading text-white mb-4"
              >
                {banners[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="subheading text-white/90 mb-8"
              >
                {banners[currentSlide].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href={banners[currentSlide].link}>
                  <button className="btn-primary">立即選購</button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentSlide([index, index > currentSlide ? 1 : -1]);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Left Right Arrows */}
      <button
        onClick={() => navigate(-1)}
        className="glass absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/70 hover:text-white transition-colors z-10"
      >
        <IoIosArrowBack className="w-6 h-6" />
      </button>
      <button
        onClick={() => navigate(1)}
        className="glass absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/70 hover:text-white transition-colors z-10"
      >
        <IoIosArrowForward className="w-6 h-6" />
      </button>
    </div>
  );
}
