import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { toast } from "sonner";
import { Product } from "@/types";

type CartStore = {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: bigint, address: string) => void;
  removeAll: () => void;
};

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === data.id && item.owner === data.owner,
        );

        if (existingItem) {
          toast.error("Product already in cart");
        } else {
          set({ items: [...get().items, data] });
          toast("Product added to cart");
        }
      },
      removeItem: (id: bigint, address: string) => {
        set({
          items: [
            ...get().items.filter(
              (item) => item.id !== id || item.owner !== address,
            ),
          ],
        });
        toast.success("Product removed from cart");
      },
      removeAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
