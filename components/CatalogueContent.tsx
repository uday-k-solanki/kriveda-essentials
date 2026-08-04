"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useShopifyProducts } from "@/lib/use-shopify-products";
import { useCMSProducts } from "@/lib/use-cms-products";
import { useCart, formatPrice } from "@/lib/cart-context";
import Reveal from "./Reveal";

type Filter = "all" | string; // supports any category id from CMS

export default function CatalogueContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const { products: shopifyProducts, loading: shopifyLoading } = useShopifyProducts();
  const { products: cmsProducts, categories, loading: cmsLoading } = useCMSProducts();
  const { addToCart, setIsCartOpen, isLoading } = useCart();

  const loading = shopifyLoading || cmsLoading;

  // Merge CMS overrides on top of Shopify products, then append CMS-only products
  const products = useMemo(() => {
    // 1. Shopify products enriched with CMS overrides
    const merged = shopifyProducts
      .map((p) => {
        const cms = cmsProducts.find((c) => c.slug === p.slug);
        if (!cms) return { ...p, visible: true };
        return {
          ...p,
          name: cms.name || p.name,
          accent: cms.accent || p.accent,
          bottle: cms.images[0]?.url || p.bottle,
          botanicalImage: cms.images[1]?.url || p.botanicalImage,
          hoverImage: cms.hoverImage || p.hoverImage,
          price: cms.originalPrice || p.price,
          discountedPrice: cms.discountedPrice,
          discountLabel: cms.discountLabel,
          isBestseller: cms.isBestseller,
          visible: cms.visible,
          category: cms.category,
          botanical: cms.botanical || p.botanical,
        };
      })
      .filter((p) => p.visible !== false);

    // 2. CMS-only products (no Shopify variant — added purely from the dashboard)
    const shopifySlugs = new Set(shopifyProducts.map((p) => p.slug));
    const cmsOnly = cmsProducts
      .filter((c) => c.visible && !shopifySlugs.has(c.slug))
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        type: (c.category === "essential" ? "Essential Oil" : "Carrier Oil") as "Essential Oil" | "Carrier Oil",
        method: (c.category === "essential" ? "Steam Distilled" : "Cold Pressed") as "Steam Distilled" | "Cold Pressed",
        botanical: c.botanical,
        origin: "",
        benefit: c.benefit,
        bottle: c.images[0]?.url ?? "",
        botanicalImage: c.images[1]?.url ?? c.images[0]?.url ?? "",
        hoverImage: c.hoverImage || undefined,
        accent: c.accent,
        // No Shopify variant — cart/checkout disabled
        variantId: "",
        price: c.originalPrice,
        discountedPrice: c.discountedPrice,
        discountLabel: c.discountLabel,
        isBestseller: c.isBestseller,
        currencyCode: "INR",
        availableForSale: false,
        shopifyId: "",
        visible: true,
        category: c.category,
      }));

    return [...merged, ...cmsOnly];
  }, [shopifyProducts, cmsProducts]);

  // Build filter tabs from CMS categories
  const filterTabs = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    return [{ id: "all", name: "All Oils" }, ...sorted.map((c) => ({ id: c.id, name: c.name }))];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (filter === "all") return products;
    // Match against category id or legacy type strings
    return products.filter((p) => {
      const cat = (p as typeof p & { category?: string }).category;
      if (cat) return cat === filter;
      if (filter === "essential") return p.type === "Essential Oil";
      if (filter === "carrier") return p.type === "Carrier Oil";
      return false;
    });
  }, [filter, products]);

  const handleAddToCart = async (p: (typeof products)[number] & { discountedPrice?: number }) => {
    if (!p.variantId) return;
    const displayPrice = p.discountedPrice ?? p.price;
    await addToCart({
      variantId: p.variantId,
      slug: p.slug,
      name: p.name,
      type: p.type,
      botanical: p.botanical,
      price: displayPrice,
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
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`rounded-full px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-wide2 transition-all duration-500 ease-luxe ${
                    filter === tab.id
                      ? "bg-botanical-deep text-ivory shadow-lg shadow-botanical-deep/20"
                      : "border border-botanical/15 bg-white/60 text-botanical/70 hover:border-gold/40 hover:text-botanical"
                  }`}
                >
                  {tab.name}
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

                      {/* Image Stage */}
                      <a href={`/products/${p.slug}`} className="relative block h-72 overflow-hidden">
                        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110" style={{ background: p.accent, opacity: 0.22 }} aria-hidden />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={p.bottle || p.botanicalImage}
                            alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()}`}
                            width={280} height={360}
                            className="h-[250px] w-[190px] object-contain drop-shadow-[0_26px_34px_rgba(46,59,44,0.35)] group-hover:-translate-y-2 group-hover:scale-[1.02]"
                            style={{ opacity: hoveredSlug === p.slug && p.hoverImage ? 0 : 1, transition: "opacity 0.5s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
                          />
                        </div>
                        {p.hoverImage && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: hoveredSlug === p.slug ? 1 : 0, transition: "opacity 0.5s ease" }}>
                            <Image src={p.hoverImage} alt={`KRIVEDA ${p.name} hover`} fill className="object-contain p-4" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5">
                          {/* Bestseller or index */}
                          {(p as typeof p & { isBestseller?: boolean }).isBestseller ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-wide text-botanical-deep shadow-sm">★ Bestseller</span>
                          ) : (
                            <span className="font-display text-xl text-gold-deep">0{i + 1}</span>
                          )}
                          <span className="rounded-full bg-botanical-deep/75 px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-wide text-gold-pale backdrop-blur-sm">
                            {(p as typeof p & { discountLabel?: string }).discountLabel || "40% off"}
                          </span>
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

                      {/* Price block */}
                      {p.price > 0 && (() => {
                        const cmsP = p as typeof p & { discountedPrice?: number; discountLabel?: string };
                        const original = p.price;
                        const sale = cmsP.discountedPrice ?? Math.round(original * 0.6);
                        const saved = original - sale;
                        const label = cmsP.discountLabel || "40% off";
                        return (
                          <div className="mt-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[1.4rem] font-bold leading-none text-botanical-deep">₹{sale}</span>
                              <span className="text-sm leading-none text-stone-mid line-through">₹{original}</span>
                              <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[0.52rem] font-semibold text-gold-deep">{label}</span>
                            </div>
                            <p className="mt-0.5 text-[0.58rem] font-medium text-gold-deep">Save ₹{saved}</p>
                          </div>
                        );
                      })()}

                      {/* Same day shipping tag */}
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-botanical/20 bg-botanical/5 px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-wide text-botanical">
                          ⚡ Same Day Shipping
                        </span>
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
