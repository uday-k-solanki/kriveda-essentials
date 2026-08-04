"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import { products, promise } from "@/lib/data";

const SLIDE_MS = 5200;

const BESTSELLERS = new Set(["virgin-coconut", "sweet-almond", "rosemary"]);

const RATINGS: Record<string, { rating: number; reviews: number }> = {
  rosemary:        { rating: 4.9, reviews: 3842 },
  "tea-tree":      { rating: 4.7, reviews: 2156 },
  lavender:        { rating: 4.8, reviews: 4391 },
  "virgin-coconut":{ rating: 4.9, reviews: 4817 },
  "sweet-almond":  { rating: 4.8, reviews: 3124 },
  jojoba:          { rating: 4.7, reviews: 1673 },
};

const HOVER_IMAGES: Record<string, string> = {
  rosemary:         "/images/botanical/hover/rosemary_hover.png",
  "tea-tree":       "/images/botanical/hover/teatree_hover.png",
  lavender:         "/images/botanical/hover/lavender_hover.png",
  "virgin-coconut": "/images/botanical/hover/coconut_hover.png",
  "sweet-almond":   "/images/botanical/hover/almond_hover.png",
  jojoba:           "/images/botanical/hover/jojoba_hover.png",
};

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars, ${reviews.toLocaleString()} reviews`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full  }).map((_, i) => <StarIcon key={`f${i}`} type="full"  />)}
        {half && <StarIcon type="half" />}
        {Array.from({ length: empty }).map((_, i) => <StarIcon key={`e${i}`} type="empty" />)}
      </div>
      <span className="text-[0.68rem] font-medium text-gold-light">{rating.toFixed(1)}</span>
      <span className="text-[0.62rem] text-ivory/40">({reviews.toLocaleString()})</span>
    </div>
  );
}

function StarIcon({ type }: { type: "full" | "half" | "empty" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      {type === "full" && (
        <path fill="#D4AF4E" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
      {type === "half" && (
        <>
          <path fill="#D4AF4E" d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path fill="rgba(212,175,78,0.25)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" />
        </>
      )}
      {type === "empty" && (
        <path fill="rgba(212,175,78,0.2)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  );
}

export default function Transparency() {
  const [active, setActive] = useState(0);
  const p = products[active];

  // Unconditional interval — always advances on the timer, never pauses.
  useEffect(() => {
    const id = setInterval(
      () => setActive((current) => (current + 1) % products.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="transparency"
      className="relative overflow-hidden bg-botanical-deep py-28 text-ivory sm:py-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-0 h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle,rgba(101,117,90,0.4),transparent_70%)]" />
        <div className="absolute bottom-0 right-[5%] h-[36vmax] w-[36vmax] rounded-full bg-[radial-gradient(circle,rgba(184,145,46,0.16),transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-editorial px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div>
            <Reveal>
              <span className="eyebrow text-gold-light">The Evidence</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-[clamp(2.6rem,5.5vw,4.75rem)] font-light leading-[0.98] tracking-[-0.01em]">
                Evidence Before
                <span className="block text-gilded">Purchasing.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-7 max-w-2xl text-pretty leading-relaxed text-ivory/65">
                Clear product details, simple usage notes, and one plant per
                bottle. Each oil shows what it is, where it comes from, and how
                it fits into your ritual.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
          <Reveal y={40} delay={0.1}>
            <div className="glass-dark relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl transition-colors duration-1000"
                  style={{ background: p.accent, opacity: 0.2 }}
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                      {/* Product image — glowing animated border */}
                      <div className="relative mx-auto flex w-full max-w-[14rem] items-center justify-center sm:max-w-[16rem]">
                        {/* Ambient glow */}
                        <div
                          className="absolute inset-0 rounded-[1.5rem] blur-xl animate-pulse"
                          style={{ background: p.accent, opacity: 0.35 }}
                        />
                        {/* Image fills the box */}
                        <a
                          href={`/products/${p.slug}`}
                          className="glow-border-wrap relative aspect-square w-full transition-transform duration-500 ease-luxe hover:scale-[1.03]"
                          style={{ "--glow-color": p.accent } as React.CSSProperties}
                        >
                          <Image
                            src={HOVER_IMAGES[p.slug] ?? p.bottle ?? p.botanicalImage}
                            alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()}`}
                            fill
                            sizes="(max-width: 1024px) 70vw, 220px"
                            className="object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.5)]"
                            priority={active === 0}
                          />
                        </a>
                      </div>

                      {/* Name + rating */}
                      <div className="flex flex-col items-start gap-2.5">
                        {BESTSELLERS.has(p.slug) && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-light/40 bg-gold/15 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-widest text-gold-light">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold-light" />
                            Bestseller
                          </span>
                        )}
                        <p className="text-[0.65rem] font-medium uppercase tracking-luxe text-gold-light/70">
                          {p.type}
                        </p>
                        <a href={`/products/${p.slug}`} className="group">
                          <h3 className="font-display text-3xl text-ivory transition-colors duration-300 group-hover:text-gold-light sm:text-4xl">
                            {p.name}
                          </h3>
                        </a>
                        <Stars rating={RATINGS[p.slug]?.rating ?? 4.7} reviews={RATINGS[p.slug]?.reviews ?? 1000} />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {products.map((prod, i) => (
                          <button
                            key={prod.slug}
                            onClick={() => setActive(i)}
                            aria-label={`Show ${prod.name}`}
                            aria-current={active === i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              active === i
                                ? "w-10 bg-gold-light"
                                : "w-2 bg-ivory/25 hover:bg-ivory/50"
                            }`}
                          />
                        ))}
                      </div>
                      <a
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-gold-light/30 px-5 py-2 text-[0.68rem] font-medium uppercase tracking-wide2 text-gold-light transition-all duration-500 ease-luxe hover:border-gold-light/70 hover:bg-white/5"
                      >
                        View Product
                        <svg width="12" height="8" viewBox="0 0 14 10" fill="none" aria-hidden>
                          <path d="M1 5h11M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
          </Reveal>
        </div>

        <div className="mt-24 border-t border-ivory/12 pt-16 sm:mt-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <h3 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.02]">
                  Clear labels.
                  <span className="block text-gilded">Simple choices.</span>
                </h3>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-6 max-w-sm text-pretty leading-relaxed text-ivory/65">
                  The essentials stay visible, so you can choose without
                  decoding a lab report.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ivory/12 bg-ivory/10 sm:grid-cols-2">
                {promise.map((item, i) => (
                  <Reveal
                    key={item}
                    as="li"
                    delay={(i % 2) * 0.06}
                    className="flex items-center gap-4 bg-botanical-deep/60 px-6 py-5"
                  >
                    <span className="font-sans text-[0.62rem] tracking-luxe text-gold-light">
                      0{i + 1}
                    </span>
                    <span className="text-sm text-ivory/85">{item}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
