import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  defaultVariantId: string;
  name: string;
  brand: string;
  size: number;
  price: number;
  image: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => set((state) => {
        const exists = state.items.find(i => i.id === item.id);
        if (exists) {
          return { items: state.items.filter(i => i.id !== item.id) };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      isInWishlist: (id) => get().items.some(i => i.id === id),
    }),
    {
      name: "scentia-wishlist-storage",
    }
  )
);
