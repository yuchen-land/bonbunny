import { useEffect, useState } from "react";
import { useCartStore } from "./cart";

/**
 * Hook to handle cart hydration state
 * Prevents hydration mismatches by waiting for client-side hydration
 */
export const useCartHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    // Mark as hydrated after the first render on client side
    setIsHydrated(true);
  }, []);

  return {
    isHydrated,
    cartItems: isHydrated ? cartStore.items : [],
    cartTotal: isHydrated ? cartStore.total : 0,
    cartItemCount: isHydrated ? cartStore.items.length : 0,
  };
};
