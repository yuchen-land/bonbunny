"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaQuestionCircle,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdInfo, MdPhone } from "react-icons/md";
import { useAuthStore } from "@/app/store/auth";
import { useCartStore } from "@/app/store/cart";
import { useFavoritesStore } from "@/app/store/favorites";
import { ProductCategory } from "@/app/types";

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.CAKE]: "蛋糕",
  [ProductCategory.COOKIE]: "餅乾",
  [ProductCategory.BREAD]: "麵包",
  [ProductCategory.PASTRY]: "點心",
  [ProductCategory.DRINK]: "飲品",
  [ProductCategory.GIFT_SET]: "禮盒",
  [ProductCategory.OTHER]: "其他",
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { favorites } = useFavoritesStore();

  const closeMenu = () => setIsMenuOpen(false);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleInfo = () => setIsInfoOpen(!isInfoOpen);

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center py-2 hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <div className="h-10 flex items-center">
              {" "}
              <Image
                src="/logo.svg"
                alt="BonBunny Logo"
                width={160}
                height={40}
                className="w-auto h-full object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* 商品分類 */}
            <div className="relative" ref={categoryRef}>
              <button
                className="nav-link flex items-center gap-1"
                onClick={toggleCategory}
                aria-expanded={isCategoryOpen}
                aria-haspopup="true"
              >
                商品分類
                <IoIosArrowDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* 商品分類下拉選單 */}
              {isCategoryOpen && (
                <div className="absolute top-full -left-4 w-40 mt-1 py-2 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-border/50 animate-in fade-in slide-in-from-top-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Link
                      key={key}
                      href={`/category/${key}`}
                      className="block px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors"
                      onClick={() => {
                        setIsCategoryOpen(false);
                        closeMenu();
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 關於我們 */}
            <div className="relative" ref={infoRef}>
              <button
                className="nav-link flex items-center gap-1"
                onClick={toggleInfo}
                aria-expanded={isInfoOpen}
                aria-haspopup="true"
              >
                關於我們
                <IoIosArrowDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isInfoOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isInfoOpen && (
                <div className="absolute top-full left-0 mt-1 py-2 w-36 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg transform opacity-100 scale-100 transition-all duration-200 ease-out">
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-2 text-sm hover:bg-background-secondary hover:text-primary transition-colors"
                    onClick={() => setIsInfoOpen(false)}
                  >
                    <MdInfo className="w-4 h-4 mr-2" />
                    品牌介紹
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-2 text-sm hover:bg-background-secondary hover:text-primary transition-colors"
                    onClick={() => setIsInfoOpen(false)}
                  >
                    <MdPhone className="w-4 h-4 mr-2" />
                    聯絡我們
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center px-4 py-2 text-sm hover:bg-background-secondary hover:text-primary transition-colors"
                    onClick={() => setIsInfoOpen(false)}
                  >
                    <FaQuestionCircle className="w-4 h-4 mr-2" />
                    常見問題
                  </Link>
                  <Link
                    href="/shipping"
                    className="flex items-center px-4 py-2 text-sm hover:bg-background-secondary hover:text-primary transition-colors"
                    onClick={() => setIsInfoOpen(false)}
                  >
                    <span className="w-4 h-4 mr-2 flex items-center justify-center">
                      🚚
                    </span>
                    運送說明
                  </Link>
                </div>
              )}
            </div>

            {/* 熱門商品 */}
            <Link
              href="/category/popular"
              className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all group"
            >
              <span className="relative">
                熱門商品
                <span className="absolute -right-1 -top-3 bg-primary text-white text-[8px] px-1 py-[2px] rounded leading-none font-bold transform -rotate-12 group-hover:rotate-0 transition-transform">
                  HOT
                </span>
              </span>
            </Link>

            {/* 聯絡我們 */}
            <Link
              href="/contact"
              className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
            >
              聯絡我們
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                管理後台
              </Link>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Favorites */}
            <Link href="/favorites" className="nav-link relative group">
              <FaHeart className="h-5 w-5 transition-colors group-hover:text-primary" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="nav-link relative">
              <FaShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 nav-link">
                  <FaUser className="h-5 w-5" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 nav-link hover:bg-background-secondary"
                    >
                      個人資料
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 nav-link text-danger hover:text-danger-hover hover:bg-background-secondary"
                    >
                      登出
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary">
                登入
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 nav-link rounded-md hover:bg-background-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-in border-t border-border">
            <div className="flex flex-col py-4 space-y-4">
              {/* 主要導航項目 */}
              {/* 關於我們 */}
              <div className="relative">
                <button
                  onClick={toggleInfo}
                  className="nav-link px-2 py-1 rounded-md w-full text-left flex justify-between items-center"
                >
                  <span>關於我們</span>
                  <IoIosArrowDown
                    className={`h-4 w-4 transition-transform ${
                      isInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 mt-1 bg-background border border-border rounded-md shadow-lg py-2 w-full ${
                    isInfoOpen ? "block" : "hidden"
                  }`}
                >
                  <Link
                    href="/about"
                    className="block px-4 py-2 hover:bg-background-secondary text-sm"
                    onClick={() => {
                      closeMenu();
                      setIsInfoOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <MdInfo className="w-4 h-4 mr-2" />
                      品牌介紹
                    </div>
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 hover:bg-background-secondary text-sm"
                    onClick={() => {
                      closeMenu();
                      setIsInfoOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <MdPhone className="w-4 h-4 mr-2" />
                      聯絡我們
                    </div>
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-4 py-2 hover:bg-background-secondary text-sm"
                    onClick={() => {
                      closeMenu();
                      setIsInfoOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <FaQuestionCircle className="w-4 h-4 mr-2" />
                      常見問題
                    </div>
                  </Link>
                  <Link
                    href="/shipping"
                    className="block px-4 py-2 hover:bg-background-secondary text-sm"
                    onClick={() => {
                      closeMenu();
                      setIsInfoOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 flex items-center justify-center">
                        🚚
                      </span>
                      運送說明
                    </div>
                  </Link>
                </div>
              </div>

              {/* 熱門商品 */}
              <Link
                href="/category/popular"
                className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md relative group"
                onClick={closeMenu}
              >
                <span className="relative inline-block">
                  熱門商品
                  <span className="absolute -right-1 -top-3 bg-primary text-white text-[8px] px-1 py-[2px] rounded leading-none font-bold transform -rotate-12 group-hover:rotate-0 transition-transform">
                    HOT
                  </span>
                </span>
              </Link>

              {/* 商品分類 */}
              <div className="relative">
                <button
                  onClick={toggleCategory}
                  className="nav-link px-2 py-1 rounded-md w-full text-left flex justify-between items-center"
                >
                  <span>商品分類</span>
                  <IoIosArrowDown
                    className={`h-4 w-4 transition-transform ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 mt-1 bg-background border border-border rounded-md shadow-lg py-2 w-full ${
                    isCategoryOpen ? "block" : "hidden"
                  }`}
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Link
                      key={key}
                      href={`/category/${key}`}
                      className="block px-4 py-2 hover:bg-background-secondary text-sm"
                      onClick={() => {
                        closeMenu();
                        setIsCategoryOpen(false);
                      }}
                    >
                      <div className="flex items-center">{label}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 聯絡我們 */}
              <Link
                href="/contact"
                className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md"
                onClick={closeMenu}
              >
                聯絡我們
              </Link>

              {/* 功能區域 */}
              <div className="pt-2 mt-2 border-t border-border space-y-4">
                {/* 購物車 */}
                <Link
                  href="/cart"
                  className="nav-link px-2 py-1 mt-4 hover:bg-background-secondary rounded-md flex items-center justify-between"
                  onClick={closeMenu}
                >
                  <span>購物車</span>
                  {cartItems.length > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                {/* 收藏清單 */}
                <Link
                  href="/favorites"
                  className="nav-link px-2 py-1 mt-4 hover:bg-background-secondary rounded-md flex items-center justify-between"
                  onClick={closeMenu}
                >
                  <span>收藏清單</span>
                  {favorites.length > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* 會員功能 */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="nav-link px-2 py-1 mt-4 hover:bg-background-secondary rounded-md"
                      onClick={closeMenu}
                    >
                      個人資料
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="nav-link px-2 py-1 mt-4 hover:bg-background-secondary rounded-md"
                        onClick={closeMenu}
                      >
                        管理後台
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="text-left nav-link px-2 py-1 mt-4 hover:bg-background-secondary rounded-md text-danger hover:text-danger-hover w-full"
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="btn-primary w-full justify-center mt-4"
                    onClick={closeMenu}
                  >
                    登入
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
