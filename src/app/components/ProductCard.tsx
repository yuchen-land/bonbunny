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
      className="group block w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass card h-full transition-all duration-300 hover:scale-[1.02]">
        {/* 商品圖片 */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-background-secondary">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          >
            {isFavorite ? (
              <FaHeart className="w-5 h-5 text-primary" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-muted hover:text-primary transition-colors" />
            )}
          </button>
          {/* 商品狀態標籤 */}
          {product.status !== ProductStatus.ACTIVE && (
            <div className="absolute bottom-3 right-3 px-2 py-1 text-xs rounded bg-black/50 backdrop-blur-sm text-white">
              {product.status === ProductStatus.SOLDOUT ? "已售完" : "暫停販售"}
            </div>
          )}
        </div>

        {/* 商品資訊 */}
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="font-medium text-primary whitespace-nowrap">
              NT$ {product.price}
            </span>
          </div>
          <p className="text-sm text-muted line-clamp-2 mb-4 min-h-[2.5rem]">
            {product.description}
          </p>
          {/* 加入購物車按鈕 */}
          <button
            onClick={handleAddToCart}
            disabled={product.status !== ProductStatus.ACTIVE}
            className={`btn-primary w-full group/btn ${
              product.status !== ProductStatus.ACTIVE ? "opacity-50" : ""
            }`}
          >
            <FaShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
            加入購物車
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
