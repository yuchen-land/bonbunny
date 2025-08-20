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
      // If not logged in, prompt user
      console.log("Please log in to add favorites");
      return;
    }

    set((state) => {
      if (!state.favorites.some((item) => item.id === product.id)) {
        // Update local state
        const newFavorites = [...state.favorites, product];

        // In a real application, this would call API to update backend data
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

    // In a real application, this would fetch complete favorite product data from API
    // Currently using mock data
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

    // Only load products that user has favorited
    const favorites = mockProducts.filter((p) =>
      auth.user?.favorites?.includes(p.id)
    );

    set({ favorites });
  },
}));
