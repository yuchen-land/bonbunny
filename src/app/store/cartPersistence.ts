// Cart persistence utilities
import { useCartStore } from "./cart";

/**
 * Initialize cart persistence
 * This should be called on app startup to ensure cart data is properly loaded
 */
export const initializeCartPersistence = () => {
  // Check if we're in the browser environment
  if (typeof window !== "undefined") {
    // The persist middleware will automatically handle hydration
    // We just need to trigger a load to ensure totals are calculated correctly
    const store = useCartStore.getState();
    store.loadCart();
  }
};

/**
 * Get cart item count from localStorage without triggering store hydration
 * Useful for server-side rendering or initial load
 */
export const getCartItemCountFromStorage = (): number => {
  if (typeof window === "undefined") return 0;

  try {
    const stored = localStorage.getItem("bonbunny-cart-storage");
    if (!stored) return 0;

    const data = JSON.parse(stored);
    const items = data?.state?.items || [];
    return items.reduce(
      (total: number, item: any) => total + (item.quantity || 0),
      0
    );
  } catch (error) {
    console.error("Error reading cart count from storage:", error);
    return 0;
  }
};

/**
 * Clear cart data from localStorage
 * Useful for cleanup or reset operations
 */
export const clearCartStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("bonbunny-cart-storage");
  }
};

/**
 * Migration helper for cart data format changes
 * Can be used to migrate old cart data to new formats
 */
export const migrateCartData = () => {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem("bonbunny-cart-storage");
    if (!stored) return;

    const data = JSON.parse(stored);

    // Check if migration is needed (example: version check)
    if (!data.version || data.version < 1) {
      // Perform migration if needed
      console.log("Migrating cart data...");

      // Update version
      data.version = 1;
      localStorage.setItem("bonbunny-cart-storage", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error migrating cart data:", error);
    // If migration fails, clear the storage to prevent issues
    clearCartStorage();
  }
};
