import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, CartItem } from "../types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
  total: number;
}

// Helper function to calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            const updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems),
            };
          }
          const newItems = [...state.items, { ...product, quantity: 1 }];
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId);
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const newItems = state.items
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0);
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        }),

      clearCart: () =>
        set(() => ({
          items: [],
          total: 0,
        })),

      loadCart: () => {
        // This function is called automatically by the persist middleware
        // We can use it for any additional cart loading logic if needed
        const state = get();
        set({
          ...state,
          total: calculateTotal(state.items),
        });
      },
    }),
    {
      name: "bonbunny-cart-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist items, total will be calculated on load
      partialize: (state) => ({ items: state.items }),
      // Hydrate function to recalculate total after loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.total = calculateTotal(state.items);
        }
      },
    }
  )
);
