import { create } from "zustand";
import { Product, ProductCategory, ProductStatus } from "../types";
import { useAuthStore } from "./auth";

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  loadFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  addFavorite: (product: Product) => {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated) {
      // 如果未登入，可以提示用戶
      console.log("請先登入以收藏商品");
      return;
    }

    set((state) => {
      if (!state.favorites.some((item) => item.id === product.id)) {
        // 更新本地狀態
        const newFavorites = [...state.favorites, product];

        // 在實際應用中，這裡會調用 API 更新後端數據
        const user = auth.user;
        if (user) {
          useAuthStore.setState({
            user: {
              ...user,
              favorites: newFavorites.map((p) => p.id),
            },
          });
        }

        return { favorites: newFavorites };
      }
      return state;
    });
  },

  removeFavorite: (productId: string) => {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated || !auth.user) return;

    set((state) => {
      const newFavorites = state.favorites.filter(
        (item) => item.id !== productId
      );
      // 更新用戶數據
      if (auth.user) {
        useAuthStore.setState({
          user: {
            ...auth.user,
            favorites: newFavorites.map((p) => p.id),
          },
        });
      }

      return { favorites: newFavorites };
    });
  },

  isFavorite: (productId: string) => {
    return get().favorites.some((item) => item.id === productId);
  },

  loadFavorites: () => {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated || !auth.user?.favorites) {
      set({ favorites: [] });
      return;
    }

    // 在實際應用中，這裡會從 API 獲取完整的收藏商品數據
    // 目前使用模擬數據
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "草莓鮮奶油蛋糕",
        description: "新鮮草莓與輕盈的鮮奶油完美結合",
        price: 580,
        images: ["/images/strawberry-cake.jpg"],
        category: ProductCategory.CAKE,
        stock: 10,
        status: ProductStatus.ACTIVE,
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
    ];

    // 只載入用戶已收藏的商品
    const favorites = mockProducts.filter((p) =>
      auth.user?.favorites?.includes(p.id)
    );

    set({ favorites });
  },
}));
