"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Product, ProductStatus } from "@/app/types";
import { useCartStore } from "@/app/store/cart";
import { useFavoritesStore } from "@/app/store/favorites";
import { useAuthStore } from "@/app/store/auth";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("請先登入以收藏商品");
      return;
    }
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block w-full h-full overflow-hidden card hover-scale"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 商品圖片 */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-background-secondary">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* 收藏按鈕 */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 shadow-sm
            ${
              isHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 sm:opacity-100 sm:scale-100"
            }
            ${
              isFavorite
                ? "bg-primary text-white"
                : "bg-background text-foreground hover:bg-primary hover:text-white"
            }`}
        >
          {isFavorite ? (
            <FaHeart className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <FaRegHeart className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>

      {/* 商品信息 */}
      <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 p-2 sm:p-0">
        <h3 className="text-base sm:text-lg font-medium truncate">
          {product.name}
        </h3>
        <p className="text-sm text-muted line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-base sm:text-lg font-bold">
            NT$ {product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-full transition-all duration-300 shadow-sm
              ${
                isHovered
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 translate-x-4 scale-95 sm:opacity-100 sm:translate-x-0 sm:scale-100"
              }
              bg-primary text-white hover:bg-primary-hover`}
          >
            <FaShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* 商品狀態標籤 */}
      {product.status === ProductStatus.SOLDOUT && (
        <div className="absolute top-2 left-2 bg-danger/90 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
          售罄
        </div>
      )}
      {product.isRecommended && (
        <div className="absolute top-2 left-2 bg-primary/90 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
          推薦
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
