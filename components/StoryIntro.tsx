"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";

export default function StoryIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const markY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="story"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-ivory via-ivory to-champagne-light py-28 sm:py-40"
    >
      <motion.span
        style={{ y: markY }}
        aria-hidden
        className="pointer-events-none absolute -right-4 top-10 select-none font-display text-[22vw] leading-none text-botanical/[0.04] sm:top-16"
      >
        Veda
      </motion.span>

      <div className="mx-auto grid max-w-editorial grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-12">
        {/* Copy */}
        <div className="md:col-span-7 md:pr-6">
          <Reveal>
            <span className="eyebrow">Our Story</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.3rem,5.2vw,4.4rem)] font-light leading-[1.02] tracking-[-0.01em] text-botanical-deep">
              Built around familiar botanicals and careful extraction.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rule-gold my-10 max-w-xs" />
          </Reveal>

          {/* <Reveal delay={0.12}>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-stone-deep">
              The Nilgiri hills where rosemary grows wild and the air smells of
              medicine before sunrise. The Kerala coast where coconuts have been
              pressed under centuries of tradition. Kashmir&rsquo;s valleys where
              lavender blooms in a window so brief you have to be there or miss
              it. The almond groves of Himachal, heavy with winter sun. The
              desert shrub — jojoba — that survives because it made its own
              perfect wax.
            </p>
          </Reveal> */}

          <Reveal delay={0.16}>
            <div className="mt-12 space-y-1.5 border-l border-gold/40 pl-6">
              {[
                "One plant.",
                "A clear method.",
                "A bottle that says what it is.",
              ].map((line) => (
                <p
                  key={line}
                  className="font-display text-2xl italic leading-snug text-botanical/90 sm:text-3xl"
                >
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Figure */}
        <div className="relative md:col-span-5">
          <motion.div style={{ y: imgY }}>
            <Reveal y={40}>
              <figure className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/50 shadow-[0_50px_90px_-50px_rgba(46,59,44,0.6)]">
                <Image
                  src="/images/texture/oil.jpg"
                  alt="A single amber oil bottle in soft natural morning light"
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-botanical-deep/30 via-transparent to-transparent" />
                <figcaption className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl px-4 py-3">
                  <span className="text-[0.65rem] uppercase tracking-luxe text-botanical">
                    Single ingredient
                  </span>
                  <span className="text-[0.65rem] tracking-wide text-gold-deep">
                    Clearly named
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </motion.div>
        </div>
      </div>

      {/* The Name */}
      <div className="mx-auto mt-28 max-w-editorial px-6 sm:mt-36">
        <Reveal>
          <span className="eyebrow">The Name</span>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={0.05} className="md:col-span-5">
            <p className="font-display text-[clamp(3rem,8vw,6rem)] font-light leading-none text-botanical-deep">
              Kri<span className="text-gold-deep">+</span>Veda
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-span-7">
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl text-botanical">
                Kri <span className="text-stone-mid">— क्रि</span>
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-stone-deep">
                To create with intention.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <h3 className="font-display text-2xl text-botanical">
                Veda <span className="text-stone-mid">— वेद</span>
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-stone-deep">
                Knowledge carried through practice, observation, and care.
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-xl text-pretty text-lg italic leading-relaxed text-botanical/80">
            Together: intentional making, guided by botanical knowledge.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
