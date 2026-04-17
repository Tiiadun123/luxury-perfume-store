import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  size: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleCart: (open?: boolean) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((state) => {
        if (!item.variantId) {
          console.error("Attempted to add item without variantId:", item);
          return state;
        }

        // Merge logic: Check for same Product ID and Size
        const existingIndex = state.items.findIndex(i => 
          (i.id === item.id && i.size === item.size) || 
          (i.variantId === item.variantId)
        );
        
        if (existingIndex > -1) {
          const newItems = [...state.items];
          const newQuantity = Math.min(10, newItems[existingIndex].quantity + item.quantity);
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newQuantity,
            variantId: item.variantId || newItems[existingIndex].variantId
          };
          return {
            items: newItems,
            isOpen: true
          };
        }
        
        return { items: [...state.items, { ...item, quantity: Math.min(10, item.quantity) }], isOpen: true };
      }),
      removeItem: (variantId) => set((state) => ({
        items: state.items.filter(i => i.variantId !== variantId)
      })),
      updateQuantity: (variantId, quantity) => set((state) => ({
        items: state.items.map(i => i.variantId === variantId ? { ...i, quantity: Math.min(10, Math.max(1, quantity)) } : i)
      })),
      toggleCart: (open) => set((state) => ({ isOpen: open ?? !state.isOpen })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "scentia-cart-storage",
    }
  )
);
