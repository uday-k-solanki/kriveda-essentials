"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  accent: string;
}

const SLIDE_DURATION = 5000;

export default function ProductGallery({ images, productName, accent }: ProductGalleryProps) {
  const [active, setActive]       = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [lightbox, setLightbox]   = useState(false);
  const [paused, setPaused]       = useState(false);
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = images.length;

  const go = useCallback((index: number, dir: 1 | -1) => {
    setDirection(dir);
    setActive(index);
    setPaused(true);
  }, []);

  const next = useCallback(() => go((active + 1) % total, 1),  [active, total, go]);
  const prev = useCallback(() => go((active - 1 + total) % total, -1), [active, total, go]);

  // Auto-advance
  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 3000);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setActive((c) => (c + 1) % total);
    }, SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, total]);

  // Keyboard in lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [lightbox, next, prev]);

  if (!images.length) return null;

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0   }),
    center: {               x: 0,                           opacity: 1   },
    exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0   }),
  };

  return (
    <>
      {/* ── Card — same footprint as the old single-image card ── */}
      <div className="flex flex-col items-center gap-3">

        {/* Main image frame — matches original h-[400px] w-[260px] / h-[480px] w-[320px] */}
        <div className="group relative h-[400px] w-[260px] overflow-hidden rounded-[2rem] sm:h-[480px] sm:w-[320px]"
             style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", boxShadow: "0 12px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)" }}>

          {/* Specular highlight */}
          <span className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rounded-t-[2rem] bg-gradient-to-b from-white/30 to-transparent" />

          {/* Bottom accent glow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 rounded-b-[2rem]"
            style={{ background: `linear-gradient(to top, ${accent}40, transparent)` }}
          />

          {/* Slide */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${productName} — image ${active + 1}`}
                fill
                sizes="(max-width: 640px) 260px, 320px"
                className="object-contain p-5 drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next — appear on hover */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/55"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/55"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* Expand to lightbox */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="View full size"
            className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:text-white"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Counter pill */}
          {total > 1 && (
            <div className="absolute bottom-3 right-3 z-20 rounded-full bg-black/40 px-2 py-0.5 text-[0.55rem] font-medium text-white/60 backdrop-blur-sm">
              {active + 1}/{total}
            </div>
          )}
        </div>

        {/* Progress dots */}
        {total > 1 && (
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > active ? 1 : -1)}
                aria-label={`Go to image ${i + 1}`}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width:      i === active ? "1.75rem" : "0.35rem",
                  background: i === active ? accent : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex w-[260px] gap-1.5 overflow-x-auto pb-0.5 sm:w-[320px]"
               style={{ scrollbarWidth: "none" }}>
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => go(i, i > active ? 1 : -1)}
                aria-label={`View image ${i + 1}`}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  outline:       i === active ? `2px solid ${accent}` : "2px solid transparent",
                  outlineOffset: "2px",
                  opacity:       i === active ? 1 : 0.45,
                }}
              >
                <Image
                  src={src}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-lg"
            onClick={() => setLightbox(false)}
          >
            <button
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white/20"
              onClick={() => setLightbox(false)}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <motion.div
              key={active}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.96,    opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-6 max-h-[88vh] w-full max-w-2xl"
              style={{ aspectRatio: "3/4" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${productName} — image ${active + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] font-medium uppercase tracking-widest text-white/40">
              {active + 1} / {total}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
