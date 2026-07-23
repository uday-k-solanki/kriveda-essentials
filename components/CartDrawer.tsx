"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
  } = useCart();

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-botanical-deep/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory shadow-2xl shadow-botanical-deep/20"
          ><div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-botanical/10 px-6 py-5">
                <div>
                  <h2 className="font-display text-2xl text-botanical-deep">
                    Your Cart
                  </h2>
                  <p className="mt-0.5 text-[0.65rem] uppercase tracking-wide2 text-stone-mid">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-botanical/5"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="text-botanical-deep"
                  >
                    <path
                      d="M1 1L17 17M17 1L1 17"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mb-4 text-stone-mid/30"
                    >
                      <path
                        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 6h18M16 10a4 4 0 01-8 0"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="font-display text-xl text-botanical/50">
                      Your cart is empty
                    </p>
                    <p className="mt-2 text-sm text-stone-mid/70">
                      Add some botanical oils to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-4 rounded-2xl border border-botanical/10 bg-white/60 p-3 backdrop-blur-sm"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            sizes="80px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display text-lg leading-tight text-botanical-deep">
                                {item.name}
                              </h3>
                              <p className="text-[0.62rem] uppercase tracking-wide2 text-stone-mid">
                                {item.type}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.slug)}
                              aria-label={`Remove ${item.name} from cart`}
                              className="text-stone-mid/50 transition-colors hover:text-botanical-deep"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M2 2L14 14M14 2L2 14"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.slug, item.quantity - 1)
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-botanical/15 text-botanical/70 transition-colors hover:border-botanical/30 hover:text-botanical"
                                aria-label="Decrease quantity"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    d="M2 6H10"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-botanical-deep">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.slug, item.quantity + 1)
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-botanical/15 text-botanical/70 transition-colors hover:border-botanical/30 hover:text-botanical"
                                aria-label="Increase quantity"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    d="M2 6H10M6 2V10"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </button>
                            </div>

                            <span className="font-display text-lg text-botanical-deep">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-botanical/10 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.65rem] uppercase tracking-wide2 text-stone-mid">
                      Subtotal
                    </span>
                    <span className="font-display text-2xl text-botanical-deep">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.6rem] text-stone-mid/60">
                    Shipping calculated at checkout
                  </p>
                  <button className="mt-5 w-full rounded-full bg-botanical-deep py-4 text-[0.72rem] font-medium uppercase tracking-wide2 text-ivory transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:shadow-lg hover:shadow-botanical-deep/25 active:translate-y-0">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
