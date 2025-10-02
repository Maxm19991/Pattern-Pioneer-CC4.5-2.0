'use client';

import { useCart } from "@/lib/store/cart";
import type { Pattern } from "@/lib/types";
import { useState } from "react";

interface AddToCartButtonProps {
  pattern: Pattern;
}

export default function AddToCartButton({ pattern }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const items = useCart((state) => state.items);

  const isInCart = items.some((item) => item.pattern.id === pattern.id);

  const handleClick = () => {
    if (!isInCart) {
      addItem(pattern);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isInCart}
      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition ${
        isInCart
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : added
          ? 'bg-green-500 text-white'
          : 'bg-primary-500 text-white hover:bg-primary-600'
      }`}
    >
      {isInCart ? 'Already in Cart' : added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
