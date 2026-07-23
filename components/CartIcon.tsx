"use client";

import { useCart } from "@/lib/cart-context";

export default function CartIcon() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      aria-label={`Cart with ${totalItems} items`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/40"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="text-botanical-deep transition-colors"
      >
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 6h18M16 10a4 4 0 01-8 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[0.55rem] font-medium text-botanical-deep">
          {totalItems}
        </span>
      )}
    </button>
  );
}
