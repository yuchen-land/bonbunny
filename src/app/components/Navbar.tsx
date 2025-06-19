"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAuthStore } from "@/app/store/auth";
import { useCartStore } from "@/app/store/cart";
import { useFavoritesStore } from "@/app/store/favorites";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { favorites } = useFavoritesStore();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-primary hover:text-primary-hover transition-colors"
            onClick={closeMenu}
          >
            BonBunny
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              首頁
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin" className="nav-link">
                管理後台
              </Link>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Favorites */}
            <Link href="/favorites" className="nav-link relative">
              <FaHeart className="h-5 w-5" />
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
              <Link
                href="/"
                className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md"
                onClick={closeMenu}
              >
                首頁
              </Link>
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md"
                  onClick={closeMenu}
                >
                  管理後台
                </Link>
              )}
              <Link
                href="/favorites"
                className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md flex items-center justify-between"
                onClick={closeMenu}
              >
                <span>收藏清單</span>
                {favorites.length > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md flex items-center justify-between"
                onClick={closeMenu}
              >
                <span>購物車</span>
                {cartItems.length > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="nav-link px-2 py-1 hover:bg-background-secondary rounded-md"
                    onClick={closeMenu}
                  >
                    個人資料
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="text-left nav-link px-2 py-1 hover:bg-background-secondary rounded-md text-danger hover:text-danger-hover"
                  >
                    登出
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="btn-primary w-full justify-center"
                  onClick={closeMenu}
                >
                  登入
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
