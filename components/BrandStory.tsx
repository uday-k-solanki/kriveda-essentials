"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { principles } from "@/lib/data";

export default function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const markY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-champagne-light via-ivory to-ivory-50 py-28 sm:py-40"
    >
      {/* Oversized watermark word */}
      <motion.span
        style={{ y: markY }}
        aria-hidden
        className="pointer-events-none absolute -right-4 top-10 select-none font-display text-[22vw] leading-none text-botanical/[0.04] sm:top-20"
      >
        Kriveda
      </motion.span>

      <div className="mx-auto grid max-w-editorial grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-10">
        {/* Left — editorial copy */}
        <div className="md:col-span-7 md:pr-10">
          <Reveal>
            <span className="eyebrow">Our Philosophy</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[0.98] tracking-[-0.01em] text-botanical-deep">
              Purposeful Creation.
              <span className="block italic text-stone-deep">
                Ancient Knowledge.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rule-gold my-10 max-w-xs" />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-stone-deep">
              KRIVEDA begins where most brands end — with the full disclosure of
              what is inside. The name joins{" "}
              <span className="italic text-botanical">kriyā</span>, the act of
              doing with intention, and{" "}
              <span className="italic text-botanical">veda</span>, knowledge
              carried across centuries.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-stone-deep">
              We make single-ingredient oils the slow way: steam distilled,
              cold pressed, and traced to a single field. Then we publish the
              evidence — botanical name, origin, method, and measured compounds
              — so trust is never asked for on faith.
            </p>
          </Reveal>

          {/* Principles */}
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-botanical/10 bg-botanical/10 sm:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal
                key={p.n}
                delay={0.1 + i * 0.08}
                className="bg-ivory-50 p-6"
              >
                <span className="font-display text-2xl text-gold-deep">
                  {p.n}
                </span>
                <h3 className="mt-3 text-sm font-medium uppercase tracking-wide2 text-botanical">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-mid">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — art-directed figure */}
        <div className="relative md:col-span-5">
          <motion.div style={{ y: imgY }} className="relative">
            <Reveal y={40}>
              <figure className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/50 bg-gradient-to-b from-champagne-light to-stone-warm/40 shadow-[0_50px_90px_-50px_rgba(46,59,44,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,250,238,0.9),transparent_65%)]" />
                <Image
                  src="/images/lavender.png"
                  alt="KRIVEDA Lavender essential oil bottle"
                  width={420}
                  height={560}
                  className="absolute left-1/2 top-1/2 w-[55%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_40px_50px_rgba(46,59,44,0.4)] animate-float-slow"
                />
                {/* glass caption plate */}
                <figcaption className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl px-4 py-3">
                  <span className="text-[0.65rem] uppercase tracking-luxe text-botanical">
                    Lavandula angustifolia
                  </span>
                  <span className="text-[0.65rem] tracking-wide text-gold-deep">
                    Kashmir
                  </span>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.2}>
              <blockquote className="mt-10 border-l border-gold/40 pl-6 font-display text-2xl italic leading-snug text-botanical/90">
                “If we cannot prove it, we do not print it.”
              </blockquote>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
