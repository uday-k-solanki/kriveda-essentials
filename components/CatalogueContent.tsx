"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useShopifyProducts } from "@/lib/use-shopify-products";
import { useCart, formatPrice } from "@/lib/cart-context";
import Reveal from "./Reveal";

type Filter = "all" | "essential" | "carrier";

export default function CatalogueContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const { products, loading } = useShopifyProducts();
  const { addToCart, setIsCartOpen, isLoading } = useCart();

  const filteredProducts = useMemo(() => {
    if (filter === "essential") return products.filter((p) => p.type === "Essential Oil");
    if (filter === "carrier") return products.filter((p) => p.type === "Carrier Oil");
    return products;
  }, [filter, products]);

  const handleAddToCart = async (p: (typeof products)[number]) => {
    if (!p.variantId) return;
    await addToCart({
      variantId: p.variantId,
      slug: p.slug,
      name: p.name,
      type: p.type,
      botanical: p.botanical,
      price: p.price,
      image: p.bottle || p.botanicalImage,
      accent: p.accent,
    });
    setAddedSlug(p.slug);
    setIsCartOpen(true);
    setTimeout(() => setAddedSlug(null), 1500);
  };

  return (
    <div className="relative">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-botanical-deep pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(101,117,90,0.25),transparent_70%)]" />
          <div className="absolute right-[10%] top-[10%] h-[30vmax] w-[30vmax] rounded-full bg-[radial-gradient(circle,rgba(184,145,46,0.12),transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-editorial px-6">
          <Reveal>
            <span className="eyebrow text-gold-light">The Collection</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[0.98] tracking-[-0.01em] text-ivory">
              Six oils. One truth.
              <span className="block italic text-stone-mid/80">Made correctly.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ivory/65">
              Three steam-distilled essential oils. Three cold-pressed carriers. One plant in each bottle — and nothing else.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="relative bg-gradient-to-b from-ivory via-ivory to-champagne-light py-16 sm:py-24">
        <div className="mx-auto max-w-editorial px-6">
          <Reveal>
            <div className="mb-12 flex flex-wrap items-center gap-3">
              {([
                { key: "all", label: "All Oils" },
                { key: "essential", label: "Essential Oils" },
                { key: "carrier", label: "Carrier Oils" },
              ] as { key: Filter; label: string }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-full px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-wide2 transition-all duration-500 ease-luxe ${
                    filter === tab.key
                      ? "bg-botanical-deep text-ivory shadow-lg shadow-botanical-deep/20"
                      : "border border-botanical/15 bg-white/60 text-botanical/70 hover:border-gold/40 hover:text-botanical"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[480px] animate-pulse rounded-[1.75rem] bg-botanical/5" />
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p, i) => {
                  const isAdding = addedSlug === p.slug;
                  return (
                    <motion.article
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => setHoveredSlug(p.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-gradient-to-b from-ivory-50 to-champagne-light/70 transition-all duration-700 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_50px_90px_-50px_rgba(46,59,44,0.6)]"
                    >
                      <span className="absolute inset-x-0 top-0 z-20 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-700 ease-luxe group-hover:scale-x-100" />

                      {/* Image Stage — click to open product page */}
                      <a href={`/products/${p.slug}`} className="relative block h-72 overflow-hidden">
                        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110" style={{ background: p.accent, opacity: 0.22 }} aria-hidden />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={p.bottle || p.botanicalImage}
                            alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()}`}
                            width={280} height={360}
                            className="h-[200px] w-[130px] object-contain drop-shadow-[0_26px_34px_rgba(46,59,44,0.35)] group-hover:-translate-y-2 group-hover:scale-[1.02]"
                            style={{ opacity: hoveredSlug === p.slug && p.hoverImage ? 0 : 1, transition: "opacity 0.5s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
                          />
                        </div>
                        {p.hoverImage && (
                          <div className="absolute inset-0" style={{ opacity: hoveredSlug === p.slug ? 1 : 0, transition: "opacity 0.5s ease" }}>
                            <Image src={p.hoverImage} alt={`KRIVEDA ${p.name} hover`} fill className="object-contain" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5">
                          <span className="font-display text-xl text-gold-deep">0{i + 1}</span>
                          <span className="rounded-full bg-white/40 px-2.5 py-1 text-[0.55rem] uppercase tracking-luxe text-botanical backdrop-blur-sm">{p.method}</span>
                        </div>
                      </a>

                    {/* Details */}
                    <div className="flex grow flex-col border-t border-botanical/10 px-6 py-5">
                      {/* Name row */}
                      <a href={`/products/${p.slug}`} className="group/title flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-2xl leading-none text-botanical-deep transition-colors duration-300 group-hover/title:text-gold-deep">{p.name}</h3>
                          <p className="mt-1 text-sm italic text-stone-mid">{p.botanical}</p>
                        </div>
                        <span className="shrink-0 text-[0.64rem] font-medium uppercase tracking-wide2 text-gold-deep">{p.type}</span>
                      </a>

                      {/* Price + origin */}
                      <div className="mt-4 flex items-center justify-between border-t border-botanical/10 pt-4">
                        <span className="font-display text-xl text-botanical-deep">
                          {p.price > 0 ? formatPrice(p.price) : "—"}
                        </span>
                        <span className="text-[0.68rem] font-medium uppercase tracking-wide2 text-stone-deep">{p.origin}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex gap-2">
                        {/* Details */}
                        <a
                          href={`/products/${p.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-botanical/20 px-4 py-2.5 text-[0.68rem] font-medium uppercase tracking-wide2 text-botanical transition-all duration-500 ease-luxe hover:border-gold/50 hover:text-gold-deep"
                        >
                          Details
                          <svg width="12" height="8" viewBox="0 0 14 10" fill="none" aria-hidden>
                            <path d="M1 5h11M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                        {/* Add to Cart */}
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={isAdding || isLoading || !p.availableForSale}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-botanical-deep px-4 py-2.5 text-[0.68rem] font-medium uppercase tracking-wide2 text-ivory transition-all duration-500 ease-luxe hover:-translate-y-0.5 hover:shadow-lg hover:shadow-botanical-deep/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <AnimatePresence mode="wait">
                            {isAdding ? (
                              <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-1.5 text-gold-light">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Added
                              </motion.span>
                            ) : !p.availableForSale ? (
                              <motion.span key="oos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>Out of Stock</motion.span>
                            ) : (
                              <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2.5V13.5M2.5 8H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                Add to Cart
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <FloatingCartCTA />
    </div>
  );
}

function FloatingCartCTA() {
  const { totalItems, totalPrice, checkoutUrl, setIsCartOpen } = useCart();
  if (totalItems === 0) return null;
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3"
    >
      <button onClick={() => setIsCartOpen(true)} className="glass flex items-center gap-4 rounded-full px-6 py-3.5 shadow-2xl shadow-botanical-deep/30">
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-botanical-deep">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[0.6rem] font-medium text-botanical-deep">{totalItems}</span>
        </div>
        <span className="text-[0.72rem] font-medium uppercase tracking-wide2 text-botanical-deep">
          {totalItems} {totalItems === 1 ? "item" : "items"} — {formatPrice(totalPrice)}
        </span>
        <span className="h-px w-4 bg-botanical/20" />
        <span className="text-[0.68rem] font-medium uppercase tracking-wide2 text-gold-deep">View Cart</span>
      </button>
      {checkoutUrl && (
        <a href={checkoutUrl} className="glass rounded-full px-5 py-3.5 text-[0.68rem] font-medium uppercase tracking-wide2 text-botanical-deep shadow-2xl shadow-botanical-deep/30 transition-colors hover:text-gold-deep">
          Checkout →
        </a>
      )}
    </motion.div>
  );
}
