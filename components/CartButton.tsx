'use client';

import Link from "next/link";
import { useCart } from "@/lib/store/cart";

export default function CartButton() {
  const itemCount = useCart((state) => state.getItemCount());

  return (
    <Link
      href="/cart"
      className="relative bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
    >
      Cart
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
