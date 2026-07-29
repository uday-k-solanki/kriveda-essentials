"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import { products, promise } from "@/lib/data";

const SLIDE_MS = 5200;

const friendlyDetails = (p: (typeof products)[number]) => [
  { label: "Best for", value: p.benefit },
  { label: "Feels like", value: p.scent },
  { label: "Made by", value: p.extraction },
  { label: "From", value: p.origin },
];

const carePoints = (p: (typeof products)[number]) => [
  p.purity,
  `Use within ${p.shelf}`,
  p.type === "Essential Oil"
    ? "Dilute before applying to skin"
    : "Use directly or blend with essential oils",
];

export default function Transparency() {
  const [active, setActive] = useState(0);
  const p = products[active];
  const details = useMemo(() => friendlyDetails(p), [p]);
  const points = useMemo(() => carePoints(p), [p]);

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
                <span className="block text-gilded">Marketing.</span>
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

        <div className="mx-auto mt-14 max-w-5xl sm:mt-16">
          <Reveal y={40} delay={0.1}>
            <div className="glass-dark relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
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
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                      <div className="relative mx-auto flex w-full max-w-[19rem] items-center justify-center">
                        <div
                          className="absolute h-72 w-72 rounded-full blur-3xl"
                          style={{ background: p.accent, opacity: 0.22 }}
                        />
                        <a href={`/products/${p.slug}`} className="liquid-glass relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] p-5 transition-transform duration-500 ease-luxe hover:scale-[1.02]">
                          <span className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[1.75rem] bg-gradient-to-b from-white/35 to-transparent" />
                          <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_0_42px_rgba(255,255,255,0.12)]" />
                          <Image
                            src={p.bottle || p.botanicalImage}
                            alt={`KRIVEDA ${p.name} ${p.type.toLowerCase()}`}
                            fill
                            sizes="(max-width: 1024px) 80vw, 260px"
                            className={`drop-shadow-[0_30px_36px_rgba(0,0,0,0.45)] ${
                              p.bottle ? "object-contain p-8" : "object-cover"
                            }`}
                            priority={active === 0}
                          />
                          {!p.bottle && (
                            <div className="absolute inset-0 bg-gradient-to-t from-botanical-deep/70 via-transparent to-transparent" />
                          )}
                          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-xl">
                            <p className="text-[0.68rem] font-medium uppercase tracking-luxe text-gold-light">
                              {p.method}
                            </p>
                            <p className="mt-1 font-display text-2xl text-ivory">
                              {p.name}
                            </p>
                          </div>
                        </a>
                      </div>

                      <div>
                        <p className="text-[0.68rem] font-medium uppercase tracking-luxe text-gold-light">
                          {p.type}
                        </p>
                        <a href={`/products/${p.slug}`} className="group mt-2 inline-block">
                          <h3 className="font-display text-4xl text-ivory transition-colors duration-300 group-hover:text-gold-light sm:text-5xl">
                            {p.name}
                          </h3>
                        </a>
                        <p className="mt-3 text-pretty text-base leading-relaxed text-ivory/70">
                          {p.tagline}
                        </p>

                        <dl className="mt-7 space-y-4">
                          {details.map((row) => (
                            <div
                              key={row.label}
                              className="rounded-2xl border border-ivory/10 bg-white/[0.04] px-4 py-3"
                            >
                              <dt className="text-[0.64rem] font-medium uppercase tracking-wide2 text-gold-light/80">
                                {row.label}
                              </dt>
                              <dd className="mt-1 text-[0.95rem] leading-relaxed text-ivory/88">
                                {row.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-3 border-t border-ivory/10 pt-6 sm:grid-cols-3">
                      {points.map((point) => (
                        <div
                          key={point}
                          className="flex min-h-12 items-center justify-center rounded-full border border-gold-light/20 bg-white/[0.06] px-4 py-2.5 text-center text-[0.68rem] font-medium uppercase tracking-wide2 text-ivory/84"
                        >
                          {point}
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex items-center justify-between gap-2">
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
