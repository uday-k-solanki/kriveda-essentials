"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";

const collections = {
  essential: {
    kicker: "Collection 01",
    title: "Essential Oils",
    accentColor: "#6F7534",
    href: "/catalogue?filter=essential",
    products: [
      { name: "Lavender",  img: "/images/botanical/lavenderfinal.png", slug: "lavender",  glow: "rgba(125,106,163,0.4)" },
      { name: "Rosemary",  img: "/images/botanical/rosemaryfinal.png", slug: "rosemary",  glow: "rgba(111,125,74,0.4)"  },
      { name: "Tea Tree",  img: "/images/botanical/teatreefinal.png",  slug: "tea-tree",  glow: "rgba(124,127,62,0.4)"  },
    ],
  },
  carrier: {
    kicker: "Collection 02",
    title: "Carrier Oils",
    accentColor: "#B8912E",
    href: "/catalogue?filter=carrier",
    products: [
      { name: "Virgin Coconut", img: "/images/botanical/coconut.png", slug: "virgin-coconut", glow: "rgba(201,180,134,0.4)" },
      { name: "Sweet Almond",  img: "/images/botanical/almond.png",  slug: "sweet-almond",  glow: "rgba(216,195,155,0.4)" },
      { name: "Jojoba",        img: "/images/botanical/jojoba.png",  slug: "jojoba",        glow: "rgba(205,169,78,0.4)"  },
    ],
  },
} as const;

type Tab = keyof typeof collections;

// Stacked positions (collapsed)
const stackPos = [
  { x: 8,  y: -8,  rotate:  7, zIndex: 10 },
  { x: -5, y: -4,  rotate: -5, zIndex: 20 },
  { x: 0,  y: 0,   rotate:  0, zIndex: 30 },
];

// Scattered positions (revealed)
const scatterPos = [
  { x: -98, y: 20,  rotate: -9,  zIndex: 10 },
  { x: 0,   y: -14, rotate:  2,  zIndex: 20 },
  { x: 98,  y: 20,  rotate:  9,  zIndex: 30 },
];

export default function CollectionsTeaser() {
  const [activeTab, setActiveTab] = useState<Tab>("essential");
  const [revealed, setRevealed] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  const col = collections[activeTab];

  // Close on outside click
  useEffect(() => {
    if (!revealed) return;
    const handler = (e: MouseEvent) => {
      if (deckRef.current && !deckRef.current.contains(e.target as Node)) {
        setRevealed(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [revealed]);

  // Reset reveal when tab changes
  const handleTabChange = (tab: Tab) => {
    setRevealed(false);
    setActiveTab(tab);
  };

  return (
    <section className="relative bg-champagne-light py-16 sm:py-20">
      <div className="mx-auto max-w-editorial px-6">

        {/* Section header */}
        <Reveal y={24}>
          <div className="mb-8 text-center">
            <p className="text-[0.65rem] uppercase tracking-luxe text-gold-deep/60">Our Collections</p>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,5vw,3rem)] font-light leading-tight text-botanical">
              Every drop, one plant.
            </h2>
          </div>
        </Reveal>

        {/* Tab switcher */}
        <Reveal y={16} delay={0.1}>
          <div className="mb-10 flex items-center justify-center gap-2">
            {(["essential", "carrier"] as Tab[]).map((tab) => {
              const isActive = activeTab === tab;
              const c = collections[tab];
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className="relative rounded-full px-5 py-2 text-[0.7rem] font-medium uppercase tracking-wide2 transition-all duration-300"
                  style={{
                    background: isActive ? c.accentColor : "transparent",
                    color: isActive ? "#F6F1E7" : "#6F6553",
                    border: `1px solid ${isActive ? c.accentColor : "rgba(111,101,83,0.3)"}`,
                  }}
                >
                  {c.title}
                  {!isActive && (
                    <span className="ml-1.5 text-[0.55rem] opacity-60">↔</span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Switch hint */}
          <p className="mb-8 text-center text-[0.62rem] uppercase tracking-widest text-stone-mid/70">
            Tap a tab to switch collections
          </p>
        </Reveal>

        {/* Deck area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Collection label */}
            <div className="mb-6 text-center">
              <p className="text-[0.6rem] uppercase tracking-luxe text-gold-deep/60">{col.kicker}</p>
              <h3 className="mt-1 font-display text-[1.5rem] font-light text-botanical sm:text-[1.8rem]">
                {col.title}
              </h3>
            </div>

            {/* Stack */}
            <div ref={deckRef} className="relative mx-auto flex flex-col items-center">
              {/* Card stack / scatter */}
              <div className="relative flex h-[210px] w-[116px] items-center justify-center sm:h-[230px] sm:w-[128px]">
                {col.products.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    animate={
                      revealed
                        ? { x: scatterPos[i].x, y: scatterPos[i].y, rotate: scatterPos[i].rotate, opacity: 1 }
                        : { x: stackPos[i].x,   y: stackPos[i].y,   rotate: stackPos[i].rotate,   opacity: 1 }
                    }
                    transition={{ type: "spring", stiffness: 220, damping: 24, delay: i * 0.06 }}
                    style={{ zIndex: scatterPos[i].zIndex, position: "absolute" }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute inset-0 -z-10 scale-110 rounded-full blur-xl transition-all duration-700"
                      style={{ background: revealed ? p.glow : "transparent" }}
                    />
                    {/* Card */}
                    <a
                      href={revealed ? `/products/${p.slug}` : undefined}
                      onClick={!revealed ? (e) => e.preventDefault() : undefined}
                      tabIndex={revealed ? 0 : -1}
                      aria-label={`${p.name} oil`}
                      className="glass flex h-[172px] w-[116px] flex-col items-center justify-center gap-1.5 rounded-[22px] sm:h-[188px] sm:w-[128px]"
                      style={{ boxShadow: "0 12px 40px -10px rgba(46,59,44,0.2)" }}
                    >
                      <Image
                        src={p.img}
                        alt={p.name}
                        width={200}
                        height={300}
                        className="h-[114px] w-auto object-contain drop-shadow-[0_10px_18px_rgba(8,14,9,0.28)] sm:h-[128px]"
                      />
                      {revealed && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.07 }}
                          className="px-2 text-center font-display text-[0.68rem] leading-tight text-botanical/80"
                        >
                          {p.name}
                        </motion.p>
                      )}
                    </a>
                  </motion.div>
                ))}

                {/* X close button — appears when revealed */}
                <AnimatePresence>
                  {revealed && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setRevealed(false)}
                      aria-label="Collapse stack"
                      className="absolute -right-2 -top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-botanical/20 bg-ivory text-[0.7rem] text-botanical/60 shadow-sm hover:bg-botanical hover:text-ivory transition-colors duration-200"
                    >
                      ✕
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Reveal / Shop CTA */}
              <div className="absolute -bottom-12 left-1/2 z-50 -translate-x-1/2">
                <AnimatePresence mode="wait">
                  {revealed ? (
                    <motion.a
                      key="shop"
                      href={col.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[0.68rem] font-medium uppercase tracking-wide2 text-ivory shadow-md transition-opacity hover:opacity-90"
                      style={{ background: col.accentColor }}
                    >
                      Shop {col.title}
                      <svg width="14" height="9" viewBox="0 0 16 10" fill="none" aria-hidden>
                        <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.a>
                  ) : (
                    <motion.button
                      key="reveal"
                      onClick={() => setRevealed(true)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-[0.68rem] font-medium uppercase tracking-wide2 transition-all duration-300 hover:bg-white/60"
                      style={{ borderColor: col.accentColor, color: col.accentColor }}
                    >
                      Reveal Oils
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
                        className="text-sm"
                      >
                        ✦
                      </motion.span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
