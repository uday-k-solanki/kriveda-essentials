"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/lib/data";
import { useCart, formatPrice } from "@/lib/cart-context";
import { getProductByHandle, LOCAL_IMAGES } from "@/lib/shopify";

import { useCMSProduct } from "@/lib/use-cms-products";

const SHOPIFY_HANDLES: Record<string, string> = {
  rosemary: "kriveda-rosemary-essential-oil-pure-steam-distilled-for-hair-growth",
  "tea-tree": "kriveda-tea-tree-essential-oil-100-pure-natural-for-skin-scalp",
  lavender: "kriveda-lavender-essential-oil-pure-calming-steam-distilled",
  "virgin-coconut": "kriveda-virgin-coconut-oil-cold-pressed-traditionally-crafted-from-kerala-coconuts",
  "sweet-almond": "kriveda-sweet-almond-oil-cold-pressed-pure-nourishing",
  jojoba: "kriveda-jojoba-oil-golden-cold-pressed-lightweight",
};

export default function ProductDetail({ product: p }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "actives" | "usage">("details");
  const [variantId, setVariantId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string>(`https://kriveda-essentials-4.myshopify.com/cart/${SHOPIFY_HANDLES[p.slug]}:1`);
  const { addToCart, setIsCartOpen } = useCart();

  // CMS overrides — pricing, images, discount label
  const { product: cms } = useCMSProduct(p.slug);
  const displayOriginalPrice = cms?.originalPrice || p.price;
  const displaySalePrice = cms?.discountedPrice ?? Math.round(p.price * 0.6);
  const discountLabel = cms?.discountLabel || "40% off";
  const isBestseller = cms?.isBestseller ?? ["virgin-coconut", "sweet-almond", "rosemary"].includes(p.slug);
  const primaryImage = cms?.images[0]?.url || p.bottle || p.botanicalImage;
  const hoverImageSrc = cms?.hoverImage || p.hoverImage;
  const accentColor = cms?.accent || p.accent;

  // Fetch real variant ID from Shopify
  useEffect(() => {
    const handle = SHOPIFY_HANDLES[p.slug];
    if (!handle) return;
    getProductByHandle(handle).then((product) => {
      if (product?.variants?.nodes?.[0]) {
        const v = product.variants.nodes[0];
        setVariantId(v.id);
        setCheckoutUrl(`https://kriveda-essentials-4.myshopify.com/cart/${v.id.replace("gid://shopify/ProductVariant/", "")}:1`);
      }
    });
  }, [p.slug]);

  const handleAddToCart = () => {
    if (!variantId) return;
    addToCart({
      variantId,
      slug: p.slug,
      name: p.name,
      type: p.type,
      botanical: p.botanical,
      price: displaySalePrice,
      image: primaryImage,
      accent: accentColor,
    });
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative min-h-[100dvh]">
      {/* ── Hero band ── */}
      <section className="relative overflow-hidden bg-botanical-deep pt-28 sm:pt-32">
        {/* Deep accent glow — full bleed, no fade to white */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          {/* Primary centre glow */}
          <div
            className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${accentColor}70, transparent 60%)` }}
          />
          {/* Secondary edge glow */}
          <div
            className="absolute -left-[10%] top-[20%] h-[40vmax] w-[40vmax] rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${accentColor}40, transparent 65%)` }}
          />
          <div
            className="absolute -right-[10%] bottom-[10%] h-[30vmax] w-[30vmax] rounded-full blur-3xl opacity-60"
            style={{ background: `radial-gradient(circle, rgba(184,145,46,0.3), transparent 65%)` }}
          />
        </div>

        <div className="relative mx-auto grid max-w-editorial grid-cols-1 gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:gap-20 lg:pb-28">
          {/* ── Liquid glass image card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Glow halo behind the card */}
            <div
              className="absolute h-80 w-80 rounded-full blur-3xl sm:h-[420px] sm:w-[420px]"
              style={{ background: accentColor, opacity: 0.35 }}
              aria-hidden
            />

            {/* Liquid glass card */}
            <div
              className="liquid-glass relative flex h-[400px] w-[260px] cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] sm:h-[480px] sm:w-[320px]"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Specular highlight */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-[2rem] bg-gradient-to-b from-white/40 to-transparent" />

              {/* Default image */}
              <Image
                src={primaryImage}
                alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()}`}
                fill
                className="object-contain p-6 drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                style={{ opacity: hovered && hoverImageSrc ? 0 : 1, transition: "opacity 0.5s ease" }}
                priority
              />

              {/* Hover image */}
              {hoverImageSrc && (
                <Image
                  src={hoverImageSrc}
                  alt={`KRIVEDA ${p.name} hover`}
                  fill
                  className="object-contain p-4"
                  style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.5s ease" }}
                />
              )}

              {/* Bottom inner glow */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-[2rem]"
                style={{ background: `linear-gradient(to top, ${accentColor}30, transparent)` }}
              />
            </div>
          </motion.div>

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[0.6rem] uppercase tracking-luxe text-gold-light backdrop-blur-sm">
                {p.method}
              </span>
              <span className="text-[0.6rem] uppercase tracking-luxe text-ivory/50">{p.type}</span>
              {isBestseller && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-wide text-botanical-deep">
                  ★ Bestseller
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5rem)] font-light leading-[0.95] tracking-[-0.02em] text-ivory">
              {p.name}
            </h1>
            <p className="mt-2 text-base italic text-ivory/55">{p.botanical}</p>

            {/* Tagline */}
            <p className="mt-5 max-w-md text-pretty text-[1rem] leading-relaxed text-ivory/75">
              {p.tagline}
            </p>

            {/* Key facts strip — no origin chip */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[p.purity, p.shelf].map((fact) => (
                <span key={fact} className="rounded-full border border-ivory/15 bg-ivory/5 px-3 py-1.5 text-[0.62rem] uppercase tracking-wide text-ivory/60 backdrop-blur-sm">
                  {fact}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full border border-botanical-mid/40 bg-botanical-mid/10 px-3 py-1.5 text-[0.62rem] uppercase tracking-wide text-ivory/70 backdrop-blur-sm">
                ⚡ Same Day Shipping
              </span>
            </div>

            {/* Price block */}
            {(() => {
              const saved = displayOriginalPrice - displaySalePrice;
              return (
                <div className="mt-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-ivory">₹{displaySalePrice}</span>
                    <span className="text-lg text-ivory/40 line-through">₹{displayOriginalPrice}</span>
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[0.6rem] font-semibold text-gold-light">
                      {discountLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.62rem] font-medium text-gold-light/80">
                    You save ₹{saved} · incl. taxes
                  </p>
                </div>
              );
            })()}

            {/* CTA buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {/* Buy Now → direct Shopify checkout */}
              <a
                href={checkoutUrl}
                className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-4 text-[0.72rem] font-medium uppercase tracking-wide2 text-botanical-deep shadow-[0_18px_45px_-18px_rgba(184,145,46,0.8)] transition-transform duration-500 ease-luxe hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 transition-transform duration-700 ease-luxe group-hover:translate-x-full" />
                Buy Now
                <svg width="14" height="10" viewBox="0 0 16 10" fill="none" className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                  <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={added || !variantId}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ivory/25 px-8 py-4 text-[0.72rem] font-medium uppercase tracking-wide2 text-ivory backdrop-blur-sm transition-all duration-500 ease-luxe hover:border-gold-pale/70 hover:bg-white/10 disabled:opacity-80"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 text-gold-light">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2.5V13.5M2.5 8H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <p className="mt-3 text-[0.6rem] text-ivory/35">Free shipping on orders over ₹999 · Secure checkout</p>
          </motion.div>
        </div>
      </section>

      {/* ── Detail tabs ── */}
      <section className="bg-gradient-to-b from-botanical-deep/95 to-botanical-deep/80 py-16 sm:py-24">
        <div className="mx-auto max-w-editorial px-6">
          {/* Tab bar */}
          <div className="mb-10 flex gap-1 rounded-full border border-ivory/10 bg-white/5 p-1 backdrop-blur-sm sm:w-fit">
            {(["details", "actives", "usage"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-[0.7rem] font-medium uppercase tracking-wide2 transition-all duration-400 ease-luxe ${
                  activeTab === tab
                    ? "bg-gold text-botanical-deep shadow-sm"
                    : "text-ivory/10 hover:text-ivory"
                }`}
              >
                {tab === "details" ? "Product Details" : tab === "actives" ? "Key Compounds" : "How to Use"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[
                  { label: "Botanical Name", value: p.botanical },
                  { label: "Plant Family", value: p.family },
                  { label: "Extraction", value: p.extraction },
                  { label: "Part Used", value: p.partUsed },
                  { label: "Origin", value: p.origin },
                  { label: "Scent Profile", value: p.scent },
                  { label: "Purity", value: p.purity },
                  { label: "Shelf Life", value: p.shelf },
                  { label: "Type", value: p.type },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-botanical/8 bg-white/50 px-5 py-4 backdrop-blur-sm">
                    <p className="text-[0.6rem] uppercase tracking-luxe text-gold-deep">{label}</p>
                    <p className="mt-1.5 text-sm text-botanical-deep">{value}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "actives" && (
              <motion.div
                key="actives"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-lg space-y-4"
              >
                {p.actives.map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between rounded-2xl border border-botanical/8 bg-white/50 px-6 py-4 backdrop-blur-sm"
                  >
                    <div>
                      <p className="text-sm font-medium text-botanical-deep">{a.name}</p>
                      <p className="mt-0.5 text-[0.62rem] uppercase tracking-wide text-botanical-deep">Natural marker</p>
                    </div>
                    <span className="font-display text-xl text-botanical-deep">{a.value}</span>
                  </motion.div>
                ))}
                <p className="mt-4 text-xs text-stone-mid/60">
                  Typical ranges for this batch type. Exact values available in the Certificate of Analysis on request.
                </p>
              </motion.div>
            )}

            {activeTab === "usage" && (
              <motion.div
                key="usage"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl space-y-5"
              >
                {p.type === "Essential Oil" ? (
                  <>
                    {[
                      { step: "01", title: "Dilute first", body: "Always dilute in a carrier oil before skin contact. Use 2–4 drops per 10 ml of carrier oil for a safe 1–2% dilution." },
                      { step: "02", title: "Aromatherapy", body: "Add 4–6 drops to a diffuser with water. Run for 30–60 minutes intervals." },
                      { step: "03", title: "Scalp & hair", body: "Mix 3–5 drops into your regular oil or conditioner. Massage gently into scalp." },
                      { step: "04", title: "Storage", body: `${p.shelf}. Keep tightly capped, away from direct sunlight.` },
                    ].map(({ step, title, body }) => (
                      <div key={step} className="flex gap-5 rounded-2xl border border-botanical/8 bg-white/50 px-6 py-5 backdrop-blur-sm">
                        <span className="font-display text-2xl text-gold-deep/50">{step}</span>
                        <div>
                          <p className="font-medium text-botanical-deep">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-stone-deep">{body}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { step: "01", title: "Direct application", body: "Apply a small amount directly to skin or hair. Warm between palms first for faster absorption." },
                      { step: "02", title: "As a carrier", body: "Dilute essential oils into this carrier at a 1–3% ratio (2–6 drops per 10 ml) before applying to skin." },
                      { step: "03", title: "Hair oiling", body: "Massage into scalp and through lengths. Leave for at least 30 minutes or overnight before washing." },
                      { step: "04", title: "Storage", body: `${p.shelf}. Store in a cool, dark place. Cap tightly after use.` },
                    ].map(({ step, title, body }) => (
                      <div key={step} className="flex gap-5 rounded-2xl border border-botanical/8 bg-white/50 px-6 py-5 backdrop-blur-sm">
                        <span className="font-display text-2xl text-gold-deep/50">{step}</span>
                        <div>
                          <p className="font-medium text-botanical-deep">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-stone-deep">{body}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Back to catalogue ── */}
      <section className="bg-champagne-light pb-20 pt-4">
        <div className="mx-auto max-w-editorial px-6">
          <a
            href="/catalogue"
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-wide2 text-botanical/60 transition-colors hover:text-botanical-deep"
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
              <path d="M15 5H2M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Collection
          </a>
        </div>
      </section>
    </div>
  );
}
