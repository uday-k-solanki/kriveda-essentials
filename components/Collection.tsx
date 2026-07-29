"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
import { products } from "@/lib/data";

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
                <span className="block italic text-stone-deep">
                  Made correctly.
                </span>
              </h2>
            </Reveal>
          </div>
          {/* <Reveal delay={0.1}>
            <p className="max-w-sm text-pretty leading-relaxed text-stone-deep md:text-right">
              Three steam-distilled essential oils. Three cold-pressed carriers.
              One plant in each bottle — and nothing else.
            </p>
          </Reveal> */}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.08} y={36}>
              <a
                href={`/products/${p.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-gradient-to-b from-ivory-50 to-champagne-light/70 transition-all duration-700 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_50px_90px_-50px_rgba(46,59,44,0.6)]"
                onMouseEnter={() => setHoveredSlug(p.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <span className="absolute inset-x-0 top-0 z-20 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-700 ease-luxe group-hover:scale-x-100" />

                {/* Stage */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110"
                    style={{ background: p.accent, opacity: 0.22 }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={p.bottle || p.botanicalImage}
                      alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()}`}
                      width={260}
                      height={360}
                      className="h-[240px] w-[155px] object-contain drop-shadow-[0_26px_34px_rgba(46,59,44,0.35)] group-hover:-translate-y-2 group-hover:scale-[1.02]"
                      style={{ opacity: hoveredSlug === p.slug && p.hoverImage ? 0 : 1, transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    />
                  </div>
                  {p.hoverImage && (
                    <div
                      className="absolute inset-0"
                      style={{ opacity: hoveredSlug === p.slug ? 1 : 0, transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    >
                      <Image
                        src={p.hoverImage}
                        alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()} hover`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-5">
                    <span className="font-display text-xl text-gold-deep">0{i + 1}</span>
                    <span className="rounded-full bg-white/40 px-2.5 py-1 text-[0.55rem] uppercase tracking-luxe text-botanical backdrop-blur-sm">
                      {p.method}
                    </span>
                  </div>
                </div>

                {/* Record plate */}
                <div className="flex grow flex-col border-t border-botanical/10 px-6 py-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-3xl leading-none text-botanical-deep transition-colors duration-300 group-hover:text-gold-deep">
                      {p.name}
                    </h3>
                    <span className="text-[0.64rem] font-medium uppercase tracking-wide2 text-gold-deep">
                      {p.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm italic text-stone-mid">{p.botanical}</p>
                  <p className="mt-3 grow text-sm leading-relaxed text-stone-deep">{p.benefit}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-botanical/10 pt-4">
                    <span className="text-[0.72rem] font-medium uppercase tracking-wide2 text-stone-deep">
                      {p.origin}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-wide2 text-botanical opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      View
                      <svg width="14" height="9" viewBox="0 0 16 10" fill="none" aria-hidden>
                        <path d="M1 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
