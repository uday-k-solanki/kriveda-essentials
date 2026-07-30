"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Particles from "./Particles";
import "./peripheral.css"

/**
 * Each oil is tied to the land that made it. The three product cards float and
 * reshuffle; whichever bottle is centered sets the background scenery, so the
 * carousel itself tells the "The Earth made it" story.
 */
const slides = [
  {
    product: "/images/botanical/rosemaryfinal.png",
    scene: "/images/scenery/nilgiri.jpg",
    name: "Rosemary Essential Oil",
    slug: "rosemary essential oil",
    qty: "15 ml",
    glow: "rgba(111,125,74,0.5)",
  },
  {
    product: "/images/botanical/coconut.png",
    scene: "/images/scenery/kerala.jpg",
    name: "Virgin Coconut Oil",
    slug: "virgin-coconut Oil",
    qty: "200 ml",
    glow: "rgba(201,180,134,0.5)",
  },
  {
    product: "/images/botanical/almond.png",
    scene: "/images/scenery/himachal.jpg",
    name: "Sweet Almond Oil",
    slug: "sweet-almond Oil",
    qty: "200 ml",
    glow: "rgba(216,195,155,0.5)",
  },
];

const RESHUFFLE_MS = 3600;

type Phase = 0 | 1 | 2;

// Shows center + right + left, hides the other 3 behind center
function slot(rel: number, gap: number, total: number) {
  if (rel === 0)
    return { x: 0, y: 0, scale: 1.12, rotate: 0, opacity: 1, zIndex: 30 };
  if (rel === 1)
    return { x: gap, y: 28, scale: 0.82, rotate: 6, opacity: 0.55, zIndex: 20 };
  if (rel === total - 1)
    return { x: -gap, y: 28, scale: 0.82, rotate: -6, opacity: 0.55, zIndex: 20 };
  return { x: 0, y: 0, scale: 0.7, rotate: 0, opacity: 0, zIndex: 10 };
}

// Card target during the intro morph, by phase.
function introPos(phase: Phase, rel: number, gap: number, total: number) {
  if (phase === 0)
    return rel === 0
      ? { x: 0, y: 0, scale: 1.35, rotate: 0, opacity: 1, zIndex: 30 }
      : { x: 0, y: 0, scale: 0.95, rotate: 0, opacity: 0, zIndex: 10 };
  if (phase === 1) {
    if (rel === 0) return { x: 0, y: 0, scale: 1.3, rotate: 0, opacity: 1, zIndex: 30 };
    if (rel === 1) return { x: gap * 0.32, y: 8, scale: 1.0, rotate: 3, opacity: 0.85, zIndex: 20 };
    if (rel === total - 1) return { x: -gap * 0.32, y: 8, scale: 1.0, rotate: -3, opacity: 0.85, zIndex: 20 };
    return { x: 0, y: 0, scale: 0.7, rotate: 0, opacity: 0, zIndex: 10 };
  }
  return slot(rel, gap, total);
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [gap, setGap] = useState(170);
  const [phase, setPhase] = useState<Phase>(reduce ? 2 : 0);

  const introDone = phase === 2;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Detect touch device — disable parallax on mobile to prevent flicker
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // ---- Layered parallax — zeroed on mobile ----
  const sceneY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 70]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 1.12]);
  const raysY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -34]);
  const motesY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -70]);
  const headlineY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -150]);
  const cardsY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -210]);
  const copyY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -110]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Responsive horizontal gap between cards.
  useEffect(() => {
    const onResize = () =>
      setGap(window.innerWidth < 640 ? 104 : window.innerWidth < 1024 ? 150 : 178);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Run the intro morph once on load.
  useEffect(() => {
    if (reduce) return;
    const t1 = setTimeout(() => setPhase(1), 750);
    const t2 = setTimeout(() => setPhase(2), 1650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce]);

  // Unconditional interval — always advances, never pauses, never resets on hover.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      RESHUFFLE_MS
    );
    return () => clearInterval(id);
  }, [reduce]);

  const current = slides[active];

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-botanical-deep px-5 pb-16 pt-28 sm:pt-32"
    >
      {/* ---------- Background scenery slideshow (slow parallax + intro zoom-out) ---------- */}
      <motion.div
        style={{ y: sceneY, scale: scrollScale, willChange: "transform" }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: introDone ? 1 : 0,
            scale: introDone ? 1 : 1.28,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {slides.map((s, i) => (
            <div
              key={s.scene}
              className="absolute inset-0 transition-opacity duration-[1600ms] ease-luxe"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <Image
                src={s.scene}
                alt={`KRIVEDA ${s.name} oil — origin scenery`}
                fill
                sizes="100vw"
                priority={i === 0}
                className={`object-cover ${reduce ? "" : "animate-kenburns"}`}
                style={{ animationDelay: `${i * -6}s` }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ---------- Overlay wash ---------- */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ opacity: introDone ? 1 : 0, transition: "opacity 1.3s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-botanical-deep/85 via-botanical-deep/60 to-botanical-deep/85" />
        <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-botanical-deep/70 to-transparent" />

        {/* roving glow that tints to the active oil */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute left-1/2 top-[54%] h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        >
          <div
            className="h-full w-full rounded-full transition-[background] duration-[1600ms]"
            style={{
              background: `radial-gradient(circle, ${current.glow}, transparent 62%)`,
            }}
          />
        </motion.div>

        {/* bottom-only dissolve into the ivory section below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ivory" />
      </div>

      {/* ---------- Angled sun rays ---------- */}
      <motion.div
        aria-hidden
        style={{ y: raysY, opacity: introDone ? undefined : 0, willChange: "transform" }}
        className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      >
        <div
          className={`absolute -left-[18%] -top-[35%] h-[150%] w-[75%] origin-top-left mix-blend-screen ${reduce ? "rotate-[22deg] opacity-50" : "animate-rays"}`}
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,249,224,0) 0px, rgba(255,249,224,0.11) 3px, rgba(255,249,224,0) 16px, rgba(255,249,224,0) 52px)",
            WebkitMaskImage:
              "radial-gradient(62% 80% at 0% 0%, #000 10%, transparent 72%)",
            maskImage:
              "radial-gradient(62% 80% at 0% 0%, #000 10%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />
        {/* warm corner glow at the ray source */}
        <div className="absolute -left-[8%] -top-[10%] h-[34vmax] w-[34vmax] rounded-full bg-[radial-gradient(circle,rgba(255,244,210,0.4),transparent_65%)] blur-2xl" />
      </motion.div>

      {/* ---------- Film grain — disabled on mobile to prevent flicker ---------- */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[2] opacity-[0.09] mix-blend-soft-light ${reduce || isMobile ? "" : "animate-grain-shift"}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      <motion.div style={{ y: motesY, willChange: "transform" }} className="pointer-events-none absolute inset-0 z-[2]">
        <Particles count={20} />
      </motion.div>

      {/* Slow travelling sheen */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute -inset-y-10 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-sheen" />
      </div>

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center text-center">
        {/* Headline + eyebrow (reveal after intro) */}
        <motion.div
          style={{ y: headlineY, opacity: fadeOut }}
          className="flex flex-col items-center"
        >
          {/* Dark glass backdrop for the headline — always readable regardless of bg image tone */}
          
            {/* Specular highlight */}
            
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 14 }}
              transition={{ duration: 0.9, delay: introDone ? 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 flex items-center justify-center gap-3 font-sans text-[0.7rem] normal-case tracking-normal text-gold-pale"
            >
              <span className="h-px w-8 shrink-0 bg-gold-pale/70" />
              <span
                className="whitespace-nowrap text-[0.78rem] font-light tracking-[0.08em] text-gold-pale/75 sm:text-[0.88rem]"
                style={{ fontFamily: "var(--font-playfair), sans-serif" }}
                id="hero-heading"
              >
                100% Pure
                <span className="mx-2 opacity-90 text-gilded">·</span>
                <span className="text-gilded font-normal">Nothing Hidden</span>
                <span className="mx-2 opacity-90 text-gilded">·</span>
                Plant-Based
              </span>
              <span className="h-px w-8 shrink-0 bg-gold-pale/50" />
            </motion.span>

            <h1 className="font-display text-[clamp(2.5rem,8vw,5.8rem)] font-light leading-[0.9] tracking-[-0.02em] text-ivory">
              <Word show={introDone} delay={0.1}>
                The Earth
              </Word>{" "}
              <Word show={introDone} delay={0.24}>
                made it<span className="text-gilded">.</span>
              </Word>
            </h1>
          
        </motion.div>

        {/* ---------- Floating liquid-glass product cards ---------- */}
        <motion.div
          style={{ y: cardsY }}
          className="relative mx-auto mt-4 flex h-[310px] w-full max-w-2xl items-start justify-center [--bh:151px] [--ch:208px] [--cw:144px] sm:mt-5 sm:h-[340px] sm:[--bh:312px] sm:[--ch:228px] sm:[--cw:162px]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured oils by origin"
        >
          {slides.map((b, i) => {
            const rel = (i - active + slides.length) % slides.length;
            const pos = introDone ? slot(rel, gap, slides.length) : introPos(phase, rel, gap, slides.length);
            const isCenter = rel === 0;
            return (
              <motion.button
                key={b.name}
                type="button"
                onClick={() => introDone && setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-label={`${b.name} oil`}
                aria-current={isCenter}
                initial={{ x: 0, y: 0, scale: 0.4, rotate: 0, opacity: 0 }}
                animate={pos}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
                style={{
                  zIndex: hovered === i ? 40 : pos.zIndex,
                  height: "var(--ch)",
                  width: "var(--cw)",
                }}
                className="absolute inset-x-0 mx-auto cursor-pointer rounded-[26px] outline-none focus-visible:ring-2 focus-visible:ring-gold-pale focus-visible:ring-offset-2 focus-visible:ring-offset-botanical-deep"
              >
                <div
                  className={`relative h-full w-full ${reduce || !introDone ? "" : "animate-float-card"}`}
                  style={{ animationDelay: `${i * 1.1}s` }}
                >
                  <div
                    className="absolute inset-0 -z-10 scale-125 rounded-full blur-2xl transition-opacity duration-700"
                    style={{ background: b.glow, opacity: isCenter ? 0.85 : 0.25 }}
                  />
                  <div className="liquid-glass relative flex h-full w-full flex-col overflow-hidden rounded-[26px] mt-10">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-12 rounded-t-[26px] bg-gradient-to-b from-white/45 to-transparent" />
                    {/* Discount chip — top left */}
                    {isCenter && introDone && (
                      <div className="absolute left-2 top-2 z-10">
                        <span className="inline-flex items-center rounded-full bg-gold/90 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-botanical-deep shadow-sm">
                          upto 40% off
                        </span>
                      </div>
                    )}
                    {/* Product image — fills the full card */}
                    <div className="flex h-full w-full items-center justify-center">
                      <Image
                        src={b.product}
                        alt={`KRIVEDA ${b.name} oil`}
                        width={300}
                        height={420}
                        priority={i === 0}
                        className=" relative w-auto object-contain drop-shadow-[0_20px_24px_rgba(8,14,9,0.55)]"
                        style={{ height: "var(--bh)" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Product info chip + progress dots + bestseller tag */}
        {introDone && (
          <motion.div
            style={{ y: cardsY }}
            className="mt-[-30px] flex flex-col items-center gap-2"
            initial={false}
            animate={{ opacity: introDone ? 1 : 0 }}
          >
            {/* Name + qty chip — above dots */}
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-botanical-deep/50 px-4 py-1.5 backdrop-blur-md">
              <span className="font-display text-[0.88rem] leading-none text-ivory/90">
                {slides[active].name}
              </span>
              <span className="h-3 w-px bg-ivory/20" />
              <span className="text-[0.75rem] uppercase tracking-widest text-ivory/50">
                {slides[active].qty}
              </span>
            </div>
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to ${slides[i].name}`}
                  className={`rounded-full transition-all duration-500 ease-luxe ${
                    i === active
                      ? "h-1.5 w-8 bg-gold-pale"
                      : "h-1.5 w-1.5 bg-ivory/30 hover:bg-ivory/60"
                  }`}
                />
              ))}
            </div>
            {/* Bestseller tag */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-widest text-gold-pale backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-pale" />
              Bestsellers
            </span>
          </motion.div>
        )}

        {/* ---------- Subheading + CTAs (reveal after intro) ---------- */}
        <motion.div
          style={{ y: copyY }}
          className="flex flex-col items-center"
          initial={false}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 24 }}
          transition={{ duration: 0.9, delay: introDone ? 0.25 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mt-4 max-w-2xl text-pretty text-[0.95rem] leading-relaxed text-ivory/75 sm:mt-5 sm:text-[1rem]">
           Rooted in Nature. Defined by Purity.
          </p>

          <div className="mt-4 flex flex-col items-center gap-2.5 sm:flex-row sm:gap-4">
            <a
              href="/catalogue"
              className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-gold px-7 py-3 text-[0.72rem] font-medium uppercase tracking-wide2 text-botanical-deep shadow-[0_18px_45px_-18px_rgba(184,145,46,0.8)] outline-none transition-transform duration-500 ease-luxe hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold-pale focus-visible:ring-offset-2 focus-visible:ring-offset-botanical-deep"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 transition-transform duration-700 ease-luxe group-hover:translate-x-full" />
              Explore Our Products
              <Arrow />
            </a>
            <a
              href="#story"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-ivory/25 px-7 py-3 text-[0.72rem] font-medium uppercase tracking-wide2 text-ivory outline-none backdrop-blur-sm transition-all duration-500 ease-luxe hover:border-gold-pale/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-gold-pale focus-visible:ring-offset-2 focus-visible:ring-offset-botanical-deep"
            >
              Our Story
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fadeOut }}
        animate={{ opacity: introDone ? 1 : 0 }}
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[0.6rem] uppercase tracking-luxe text-ivory/55">
          Scroll
        </span>
        <span className="relative h-9 w-px overflow-hidden bg-ivory/25">
          <span className="absolute inset-x-0 top-0 h-3 w-px animate-[drop_2.4s_ease-in-out_infinite] bg-gold-pale" />
        </span>
      </motion.div>

      <style jsx>{`
        @keyframes drop {
          0% {
            transform: translateY(-100%);
          }
          60%,
          100% {
            transform: translateY(400%);
          }
        }
      `}</style>
    </section>
  );
}

function Word({
  children,
  delay,
  show,
}: {
  children: React.ReactNode;
  delay: number;
  show: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: show ? 0 : "110%" }}
        transition={{ duration: 1, delay: show ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      className="transition-transform duration-500 ease-luxe group-hover:translate-x-1"
      aria-hidden
    >
      <path
        d="M1 5h13M10 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
