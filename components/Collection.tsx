"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
import { products } from "@/lib/data";
import { PRODUCT_CONFIG, getSavings } from "@/lib/product-config";

const BESTSELLERS = new Set(["virgin-coconut", "sweet-almond", "rosemary"]);

const RATINGS: Record<string, { rating: number; reviews: number }> = {
  rosemary:         { rating: 4.9, reviews: 3842 },
  "tea-tree":       { rating: 4.7, reviews: 2156 },
  lavender:         { rating: 4.8, reviews: 4391 },
  "virgin-coconut": { rating: 4.9, reviews: 4817 },
  "sweet-almond":   { rating: 4.8, reviews: 3124 },
  jojoba:           { rating: 4.7, reviews: 1673 },
};

const FULL_NAMES: Record<string, string> = {
  rosemary:         "Rosemary Essential Oil",
  "tea-tree":       "Tea Tree Essential Oil",
  lavender:         "Lavender Essential Oil",
  "virgin-coconut": "Virgin Coconut Oil",
  "sweet-almond":   "Sweet Almond Oil",
  jojoba:           "Jojoba Oil",
};

function Stars({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full  }).map((_, i) => <StarIcon key={`f${i}`} type="full"  />)}
      {half && <StarIcon type="half" />}
      {Array.from({ length: empty }).map((_, i) => <StarIcon key={`e${i}`} type="empty" />)}
    </div>
  );
}

function StarIcon({ type }: { type: "full" | "half" | "empty" }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
      {type === "full"  && <path fill="#B8912E" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>}
      {type === "half"  && <><path fill="#B8912E" d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path fill="rgba(184,145,46,0.2)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/></>}
      {type === "empty" && <path fill="rgba(184,145,46,0.2)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>}
    </svg>
  );
}

export default function Collection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section
      id="collection"
      className="relative overflow-hidden bg-gradient-to-b from-ivory-50 via-ivory to-champagne-light py-28 sm:py-40"
    >
      <div className="mx-auto max-w-editorial px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="eyebrow">The Collection</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-light leading-[0.98] tracking-[-0.01em] text-botanical-deep">
                Six oils. One truth.
                <span className="block italic text-stone-deep">Made correctly.</span>
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const cfg   = PRODUCT_CONFIG[p.slug];
            const sale  = cfg?.discountedPrice ?? p.price;
            const orig  = cfg?.originalPrice   ?? p.price;
            const saved = getSavings(p.slug);
            const label = cfg?.discountLabel   ?? "";
            const qty   = cfg?.qty             ?? "";
            const rData = RATINGS[p.slug];
            const isBS  = cfg?.isBestseller ?? BESTSELLERS.has(p.slug);

            return (
              <Reveal key={p.slug} delay={(i % 3) * 0.08} y={36}>
                <a
                  href={`/products/${p.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-gradient-to-b from-ivory-50 to-champagne-light/70 transition-all duration-700 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_50px_90px_-50px_rgba(46,59,44,0.6)]"
                  onMouseEnter={() => setHoveredSlug(p.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  {/* Top shimmer on hover */}
                  <span className="absolute inset-x-0 top-0 z-20 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-700 ease-luxe group-hover:scale-x-100" />

                  {/* Image stage */}
                  <div className="relative h-60 overflow-hidden">
                    <div
                      className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110"
                      style={{ background: p.accent, opacity: 0.22 }}
                      aria-hidden
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={p.bottle || p.botanicalImage}
                        alt={`KRIVEDA ${p.name}`}
                        width={260}
                        height={360}
                        className="h-[220px] w-auto object-contain drop-shadow-[0_26px_34px_rgba(46,59,44,0.35)] transition-all duration-700 ease-luxe group-hover:-translate-y-2 group-hover:scale-[1.02]"
                        style={{ opacity: hoveredSlug === p.slug && p.hoverImage ? 0 : 1, transition: "opacity 0.5s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
                      />
                    </div>
                    {p.hoverImage && (
                      <div
                        className="absolute inset-0"
                        style={{ opacity: hoveredSlug === p.slug ? 1 : 0, transition: "opacity 0.5s ease" }}
                      >
                        <Image src={p.hoverImage} alt={`${p.name} hover`} fill className="object-contain" />
                      </div>
                    )}

                    {/* Badges — top row */}
                    <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-4">
                      {/* Bestseller or method */}
                      {isBS ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-wide text-botanical-deep shadow-sm">
                          ★ Bestseller
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/40 px-2.5 py-1 text-[0.52rem] uppercase tracking-luxe text-botanical backdrop-blur-sm">
                          {p.method}
                        </span>
                      )}
                      {/* Discount badge */}
                      <span className="rounded-full bg-botanical-deep/80 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-wide text-gold-pale backdrop-blur-sm">
                        {label}
                      </span>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div className="flex grow flex-col border-t border-botanical/10 px-5 py-4">

                    {/* 1 — Full product name */}
                    <h3 className="font-display text-[1.45rem] leading-tight text-botanical-deep transition-colors duration-300 group-hover:text-gold-deep">
                      {FULL_NAMES[p.slug] ?? p.name}
                    </h3>

                    {/* 2 — Qty + type inline */}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[0.6rem] font-medium uppercase tracking-wide2 text-stone-mid">
                        {p.type}
                      </span>
                      <span className="h-2.5 w-px bg-stone-mid/30" />
                      <span className="text-[0.6rem] font-medium uppercase tracking-wide2 text-stone-mid">
                        {qty}
                      </span>
                    </div>

                    {/* 3 — Stars + review count */}
                    {rData && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Stars rating={rData.rating} />
                        <span className="text-[0.65rem] font-semibold text-gold-deep">{rData.rating.toFixed(1)}</span>
                        <span className="text-[0.6rem] text-stone-mid">({rData.reviews.toLocaleString()})</span>
                      </div>
                    )}

                    {/* 4 — Pricing block */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-[1.5rem] font-bold leading-none text-botanical-deep">
                        ₹{sale}
                      </span>
                      <span className="text-sm leading-none text-stone-mid line-through">
                        ₹{orig}
                      </span>
                      <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[0.55rem] font-semibold text-gold-deep">
                        {label}
                      </span>
                    </div>

                    {/* 5 — Savings + shipping row */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[0.6rem] font-medium text-gold-deep">
                        Save ₹{saved}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-botanical/20 bg-botanical/5 px-2 py-0.5 text-[0.55rem] font-medium uppercase tracking-wide text-botanical">
                        ⚡ Same Day Shipping
                      </span>
                    </div>

                    {/* CTA row */}
                    <div className="mt-3 flex items-center justify-between border-t border-botanical/10 pt-3">
                      <span className="text-[0.6rem] uppercase tracking-wide2 text-stone-mid">
                        {p.method}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-wide2 text-botanical opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        Shop now
                        <svg width="14" height="9" viewBox="0 0 16 10" fill="none" aria-hidden>
                          <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
