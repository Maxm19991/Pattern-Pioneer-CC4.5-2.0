import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pattern, CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (pattern: Pattern) => void;
  removeItem: (patternId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (pattern: Pattern) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.pattern.id === pattern.id
          );

          if (existingItem) {
            // Pattern already in cart, don't add duplicate
            return state;
          }

          return {
            items: [...state.items, { pattern, quantity: 1 }],
          };
        });
      },

      removeItem: (patternId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.pattern.id !== patternId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.pattern.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
